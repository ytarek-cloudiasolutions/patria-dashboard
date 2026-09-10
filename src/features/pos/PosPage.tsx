import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryTabs from "./components/CategoryTabs";
import EmployeeAccountsDialog from "./components/EmployeeAccountsDialog";
import OrderCart from "./components/OrderCart";
import PaymentDialog from "./components/PaymentDialog";
import PaymentRegistrationDialog from "./components/PaymentRegistrationDialog";
import PendingOrdersDialog from "./components/PendingOrdersDialog";
import PosShell from "./components/PosShell";
import PosSidebar from "./components/PosSidebar";
import PosTopbar from "./components/PosTopbar";
import ProductCustomizeDialog from "./components/ProductCustomizeDialog";
import ProductGrid from "./components/ProductGrid";
import ReceiptDialog from "./components/ReceiptDialog";
import SelectStaffDialog from "./components/SelectStaffDialog";
import ShiftSummaryDialog from "./components/ShiftSummaryDialog";
import OrderConfirmedDialog from "./components/OrderConfirmedDialog";
import AwaitingManagerApprovalDialog from "./components/AwaitingManagerApprovalDialog";
import type { DiscountOfferItem } from "./components/SelectDiscountOfferDialog";
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "@/features/offers/api/cashierDiscountsApi";
import {
  subscribeDiscountEvents,
  broadcastDiscountEvent,
} from "@/features/offers/utils/discountSocketBus";
import { playNotificationSound } from "@/shared/lib/notificationSound";
import { getSocket } from "@/shared/lib/socket";

import {
  EMPLOYEE_ACCOUNTS,
  nextLineId,
} from "./data";
import type {
  CartExtra,
  CartItem,
  EmployeeAccount,
  OrderType,
  PendingOrder,
  PosCategory,
  PosProduct,
  PaymentMethod,
} from "./types";
import { computeTotals, formatTime } from "./utils";
import OpenShiftDialog from "./components/OpenShiftDialog";
import CloseShiftDialog from "./components/CloseShiftDialog";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useTables } from "@/features/tables/hooks/useTables";
import { useShifts } from "@/features/shifts/hooks/useShifts";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";

const PosPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Backend data
  const { products, getProducts } = useProducts();
  const { categories, getCategories } = useCategories();
  const { createNewOrder, isCreatingOrder, successMessage, errors } = useOrders();
  const { tables, getTables } = useTables();
  const {
    currentShift,
    loading: shiftsLoading,
    openShift: apiOpenShift,
    closeShift: apiCloseShift,
    getCurrentShift,
  } = useShifts();

  // Order context
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTable, setSelectedTable] = useState("");
  const [customerCount, setCustomerCount] = useState(0);
  const [customer, setCustomer] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sentToKitchen, setSentToKitchen] = useState(false);

  // Menu browsing
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Terminal chrome
  const [isOpenShiftDialogOpen, setIsOpenShiftDialogOpen] = useState(false);
  const [isCloseShiftDialogOpen, setIsCloseShiftDialogOpen] = useState(false);
  const [isTableMenuOpen, setTableMenuOpen] = useState(false);
  const [timeLabel, setTimeLabel] = useState(() => formatTime(new Date()));

  // Active shift is driven by backend GET /pos/shifts/current response
  const isShiftActive = Boolean(currentShift && currentShift.status === "open");

  useEffect(() => {
    getProducts({ limit: 100 });
    getCategories();
    getTables();
    getCurrentShift();
  }, [getProducts, getCategories, getTables, getCurrentShift]);

  const handleOpenShiftConfirm = (openingCash: number, notes: string) => {
    const trimmedNotes = notes.trim();
    apiOpenShift({
      openingBalance: openingCash,
      openingCash: openingCash,
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    });
    setIsOpenShiftDialogOpen(false);
  };

  const [summaryShiftId, setSummaryShiftId] = useState<string | null>(null);

  const handleCloseShiftConfirm = (closingCash: number, notes: string) => {
    const shiftId = (currentShift as any)?._id || (currentShift as any)?.id || "";
    const trimmedNotes = notes.trim();
    if (shiftId) setSummaryShiftId(shiftId);
    apiCloseShift({
      shiftId,
      closingBalance: closingCash,
      closingCash: closingCash,
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    });
    setIsCloseShiftDialogOpen(false);
    setShiftSummaryOpen(true);
  };

  // Dialogs
  const [customizeProduct, setCustomizeProduct] = useState<PosProduct | null>(null);
  const [editingLine, setEditingLine] = useState<CartItem | null>(null);
  const [isCustomizeOpen, setCustomizeOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [isOrderConfirmedOpen, setOrderConfirmedOpen] = useState(false);
  const [orderConfirmedData, setOrderConfirmedData] = useState<{
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    orderType: string;
    selectedTable: string;
    cartItems: CartItem[];
    paymentMethod: string;
    guestCount: number;
  } | null>(null);
  const [isShiftSummaryOpen, setShiftSummaryOpen] = useState(false);
  const [isSelectStaffOpen, setSelectStaffOpen] = useState(false);
  const [isEmployeeAccountsOpen, setEmployeeAccountsOpen] = useState(false);
  const [isPaymentRegOpen, setPaymentRegOpen] = useState(false);
  const [payAccount, setPayAccount] = useState<EmployeeAccount | null>(null);
  const [isPendingOpen, setPendingOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [pendingCreatePayload, setPendingCreatePayload] = useState<null | { method: PaymentMethod }>(null);
  const [loadedOrderId, setLoadedOrderId] = useState<string | null>(null);
  // Line IDs already confirmed on the backend order — used to detect newly
  // added items on a loaded pending order that still need to be sent to the kitchen.
  const [sentLineIds, setSentLineIds] = useState<Set<string>>(new Set());
  const [shiftOrders, setShiftOrders] = useState<Array<{ method: PaymentMethod; total: number }>>([]);
  const [appliedDiscountInfo, setAppliedDiscountInfo] = useState<{
    id?: string;
    name: string;
    value: number;
    amount: number;
  } | null>(null);
  const wasCreatingRef = useRef(false);
  const pendingPaymentRef = useRef<{ method: PaymentMethod; total: number } | null>(null);

  // Pending discount request awaiting approval for currently loaded order
  const [isAwaitingApprovalOpen, setIsAwaitingApprovalOpen] = useState(false);
  const [pendingDiscountRequest, setPendingDiscountRequest] =
    useState<DiscountApprovalRequestItem | null>(null);
  const [isCancellingDiscount, setIsCancellingDiscount] = useState(false);

  const pendingDiscountOffer: DiscountOfferItem | null = useMemo(() => {
    if (!pendingDiscountRequest) return null;
    return {
      id:
        pendingDiscountRequest.discountId ||
        pendingDiscountRequest.discount?._id ||
        pendingDiscountRequest.discount?.id ||
        "",
      name:
        pendingDiscountRequest.discountName ||
        pendingDiscountRequest.discount?.name ||
        "Discount",
      value:
        pendingDiscountRequest.discountValue ??
        pendingDiscountRequest.discount?.value ??
        0,
      requiresApproval: true,
    };
  }, [pendingDiscountRequest]);

  useEffect(() => {
    getProducts({ limit: 100 });
    getCategories();
    getTables();
  }, [getProducts, getCategories, getTables]);

  // Check cashier's discount requests (GET /cashier-discounts/requests/mine) for real-time status updates
  const syncDiscountStatus = useCallback(async () => {
    try {
      const requests = await cashierDiscountsApi.getMyDiscountRequests();
      if (!Array.isArray(requests)) return;

      const targetReqId =
        pendingDiscountRequest?._id || pendingDiscountRequest?.id;

      const match = requests.find((r) => {
        const reqId = r._id || r.id;
        if (targetReqId && reqId === targetReqId) return true;

        if (loadedOrderId) {
          const raw = r.orderId;
          if (typeof raw === "string") {
            return String(raw).toLowerCase() === String(loadedOrderId).toLowerCase();
          }
          if (typeof raw === "object" && raw) {
            const candidateIds = [raw._id, raw.id, raw.orderId]
              .filter(Boolean)
              .map((x) => String(x).toLowerCase());
            return candidateIds.includes(String(loadedOrderId).toLowerCase());
          }
        }

        if (isAwaitingApprovalOpen && (r.status === "approved" || r.status === "rejected")) {
          return true;
        }

        return false;
      });

      if (!match) return;

      if (match.status === "approved") {
        playNotificationSound();
        showSuccessToast(t("Discount approved by manager!"));
        setIsAwaitingApprovalOpen(false);
        setPendingDiscountRequest(null);
      } else if (match.status === "rejected") {
        showErrorToast(t("Discount request was rejected"));
        setIsAwaitingApprovalOpen(false);
        setPendingDiscountRequest(null);
      } else if (match.status === "pending") {
        setPendingDiscountRequest(match);
      }
    } catch (err) {
      console.error("Failed to sync discount status:", err);
    }
  }, [
    pendingDiscountRequest,
    loadedOrderId,
    isAwaitingApprovalOpen,
    t,
  ]);

  // Listen for real-time discount events via Socket.IO & BroadcastChannel
  useEffect(() => {
    // 1. Bus subscription (all socket events + broadcast events)
    const unsubscribe = subscribeDiscountEvents(() => {
      syncDiscountStatus();
    });

    // 2. Direct socket events from backend
    const socket = getSocket();
    const handleSocketUpdate = () => {
      syncDiscountStatus();
    };

    socket.on("connect", handleSocketUpdate);
    socket.on("discount_request_updated", handleSocketUpdate);
    socket.on("discount_request_approved", handleSocketUpdate);
    socket.on("discount_request_rejected", handleSocketUpdate);
    socket.on("discount_request_created", handleSocketUpdate);
    socket.on("discount_request_cancelled", handleSocketUpdate);
    socket.on("orderDiscountUpdated", handleSocketUpdate);
    socket.on("orderUpdated", handleSocketUpdate);

    return () => {
      unsubscribe();
      socket.off("connect", handleSocketUpdate);
      socket.off("discount_request_updated", handleSocketUpdate);
      socket.off("discount_request_approved", handleSocketUpdate);
      socket.off("discount_request_rejected", handleSocketUpdate);
      socket.off("discount_request_created", handleSocketUpdate);
      socket.off("discount_request_cancelled", handleSocketUpdate);
      socket.off("orderDiscountUpdated", handleSocketUpdate);
      socket.off("orderUpdated", handleSocketUpdate);
    };
  }, [syncDiscountStatus]);

  // While awaiting approval dialog is open, heartbeat sync every 2.5s for instant resolution
  useEffect(() => {
    if (!isAwaitingApprovalOpen) return;

    syncDiscountStatus();
    const interval = setInterval(syncDiscountStatus, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [isAwaitingApprovalOpen, syncDiscountStatus]);

  // Dynamically map backend tables to POS dropdown options. No mock fallback —
  // a silent fallback to fake table numbers here previously masked a real bug
  // (staff-role users got 403 from GET /tables and never noticed, since the
  // dropdown kept showing plausible-looking fake tables instead of erroring).
  const tableOptions = useMemo(() => {
    if (!tables || tables.length === 0) return [];

    const available = tables
      .filter((t) => t.status === "available")
      .sort((a, b) => a.number - b.number);

    const busy = tables
      .filter((t) => t.status !== "available")
      .sort((a, b) => a.number - b.number);

    const options: any[] = [];

    if (available.length > 0) {
      options.push({ label: "Available", value: "hdr-available", isHeader: true });
      available.forEach((t) => {
        options.push({ value: `Table ${t.number}`, label: `Table ${t.number}` });
      });
    }

    if (busy.length > 0) {
      options.push({ label: "Busy", value: "hdr-busy", isHeader: true });
      busy.forEach((t) => {
        options.push({ value: `Table ${t.number}`, label: `Table ${t.number}` });
      });
    }

    if (options.length === 0) {
      return [...tables]
        .sort((a, b) => a.number - b.number)
        .map((t) => `Table ${t.number}`);
    }

    return options;
  }, [tables]);


  useEffect(() => {
    const timer = window.setInterval(
      () => setTimeLabel(formatTime(new Date())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  // Detect when order creation finishes (loading true → false)
  useEffect(() => {
    if (wasCreatingRef.current && !isCreatingOrder) {
      wasCreatingRef.current = false;
      if (errors.create) {
        setPendingCreatePayload(null);
        // saga already shows error toast
      } else if (successMessage) {
        if (pendingPaymentRef.current) {
          setShiftOrders((prev) => [...prev, pendingPaymentRef.current!]);
          pendingPaymentRef.current = null;
        }
        setPendingCreatePayload(null);
        setPaymentOpen(false);
        finishWithReceipt();
      }
    }
    if (isCreatingOrder) {
      wasCreatingRef.current = true;
    }
  }, [isCreatingOrder, successMessage, errors.create]);

  // Fetch products whenever search or activeCategory changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const params: Record<string, any> = { limit: 100 };
      if (search.trim()) {
        params.search = search.trim();
      }
      if (activeCategory !== "all") {
        const selectedCategoryObj = categories.find(
          (c) => (c.name || "").toLowerCase().replace(/\s+/g, "-") === activeCategory
        );
        if (selectedCategoryObj) {
          params.category = selectedCategoryObj.id || selectedCategoryObj.name;
        } else {
          params.category = activeCategory;
        }
      }
      getProducts(params);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, activeCategory, categories, getProducts]);

  // Map backend products → PosProduct (excluding raw ingredients)
  const posProducts: PosProduct[] = useMemo(() => {
    return products
      .filter((p) => {
        const isIngr =
          p.isIngredient ||
          (p as any).category?.isIngredient ||
          (p.category || "").toLowerCase().trim() === "raw ingredients" ||
          (p.category || "").toLowerCase().trim() === "raw ingredient" ||
          (p.category || "").toLowerCase().trim() === "ingredients" ||
          (p.category || "").trim() === "المكونات الخام";
        return !isIngr;
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: (p as any).originalPrice,
        category: (p.category || "").toLowerCase().replace(/\s+/g, "-"),
        imageUrl: p.imageUrl,
        extras: p.extras?.map((e) => ({ id: e.id, name: e.name, price: e.price })) ?? [],
        variantGroups: p.variantGroups ?? [],
        recipe: p.recipe ?? [],
        stockBadge: (p.quantity ?? 0) < 10 && (p.quantity ?? 0) > 0
          ? `Low - ${p.quantity}`
          : undefined,
      }));
  }, [products]);

  // Map backend categories → PosCategory (excluding raw ingredients categories, prepend "All")
  const posCategories: PosCategory[] = useMemo(() => {
    const filteredCategories = categories.filter((c) => {
      const isIngr =
        (c as any).isIngredient ||
        (c.name || "").toLowerCase().trim() === "raw ingredients" ||
        (c.name || "").toLowerCase().trim() === "raw ingredient" ||
        (c.name || "").toLowerCase().trim() === "ingredients" ||
        (c.name || "").trim() === "المكونات الخام";
      return !isIngr;
    });

    const cats: PosCategory[] = [
      { id: "all", label: "All", imageUrl: "" },
      ...filteredCategories.map((c) => ({
        id: (c.name || "").toLowerCase().replace(/\s+/g, "-"),
        label: c.name,
        imageUrl: "",
      })),
    ];
    return cats;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        query.length === 0 || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, posProducts]);

  const totals = useMemo(() => computeTotals(cartItems), [cartItems]);
  const cartProductIds = useMemo(
    () => cartItems.map((item) => item.productId),
    [cartItems],
  );
  const resolvedTable = selectedTable;

  // --- Cart mutations -------------------------------------------------------

  const removeItem = (lineId: string) =>
    setCartItems((prev) => prev.filter((item) => item.lineId !== lineId));

  const updateQty = (lineId: string, delta: number) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.lineId === lineId
            ? { ...item, qty: item.qty + delta }
            : item,
        )
        .filter((item) => item.qty > 0),
    );

  const toggleExtra = (lineId: string, extraId: string) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId
          ? {
            ...item,
            extras: item.extras.map((extra) =>
              extra.id === extraId
                ? { ...extra, selected: !extra.selected }
                : extra,
            ),
          }
          : item,
      ),
    );

  // --- Product customization ------------------------------------------------

  const openCustomize = (product: PosProduct) => {
    setCustomizeProduct(product);
    setEditingLine(null);
    setCustomizeOpen(true);
  };

  const openEdit = (lineId: string) => {
    const line = cartItems.find((item) => item.lineId === lineId);
    if (!line) return;
    setCustomizeProduct({
      id: line.productId,
      name: line.name,
      price: line.unitPrice,
      category: "",
      imageUrl: "",
      extras: line.extras.map(({ id, name, price }) => ({ id, name, price })),
    });
    setEditingLine(line);
    setCustomizeOpen(true);
  };

  const confirmCustomize = ({
    extras,
    instructions,
    qty,
  }: {
    extras: CartExtra[];
    instructions: string;
    qty: number;
  }) => {
    if (!customizeProduct) return;

    if (editingLine) {
      const lineId = editingLine.lineId;
      setCartItems((prev) =>
        prev.map((item) =>
          item.lineId === lineId ? { ...item, extras, instructions, qty } : item,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          lineId: nextLineId(),
          productId: customizeProduct.id,
          name: customizeProduct.name,
          unitPrice: customizeProduct.price,
          qty,
          extras,
          instructions,
        },
      ]);
      // Adding a new product to an already-loaded pending order means there's
      // something new to send to the kitchen — flip the cart back to that state.
      if (loadedOrderId) setSentToKitchen(false);
    }

    setCustomizeOpen(false);
  };

  const handleTableChange = (newTable: string) => {
    setSelectedTable(newTable);
    if (!newTable) {
      setCustomerCount(0);
      return;
    }
    const match = tables?.find(
      (t) => `Table ${t.number}` === newTable || `${t.number}` === newTable || t._id === newTable
    );
    if (match && typeof match.capacity === "number" && match.capacity > 0) {
      setCustomerCount(match.capacity);
    } else {
      setCustomerCount(1);
    }
  };

  // --- Order completion -----------------------------------------------------

  const completeOrder = () => {
    setCartItems([]);
    setNotes("");
    setCustomer("");
    setCustomerPhone("");
    setSelectedTable("");
    setCustomerCount(0);
    setSentToKitchen(false);
    setLoadedOrderId(null);
    setSentLineIds(new Set());
    setAppliedDiscountInfo(null);
    setPendingDiscountRequest(null);
    setIsAwaitingApprovalOpen(false);
  };

  const handleSendToKitchen = async () => {
    if (!isShiftActive) {
      showErrorToast(t("Please open a shift before sending orders to kitchen"));
      setIsOpenShiftDialogOpen(true);
      return;
    }

    if (cartItems.length === 0) return;

    if (orderType === "dine-in" && !selectedTable) {
      showErrorToast(t("Please select a table before sending to kitchen"));
      return;
    }

    if (loadedOrderId) {
      const newItems = cartItems.filter((item) => !sentLineIds.has(item.lineId));
      if (newItems.length > 0) {
        try {
          const { api } = await import("@/config/api");
          await api.patch(`/orders/${loadedOrderId}/items`, {
            items: newItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.qty,
              price: item.unitPrice,
              notes: item.instructions || undefined,
            })),
          });
          showSuccessToast("Sent to kitchen");
        } catch {
          showErrorToast("Failed to send items to kitchen");
          return;
        }
      }
    } else {
      // Brand-new dine-in order: actually create it now so the kitchen board
      // and Pending Orders pick it up. Payment method is set later at checkout.
      try {
        const { createOrder } = await import("@/features/orders/api/ordersApi");
        await createOrder({
          type: orderType === "dine-in" ? "dine_in" : "takeaway",
          source: "pos",
          customerName: customer || "Walk-in Customer",
          customerPhone: customerPhone || undefined,
          address: orderType === "dine-in" ? resolvedTable : undefined,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.qty,
            price: item.unitPrice,
            notes: item.instructions || undefined,
          })),
          notes: notes || undefined,
          guestCount: orderType === "dine-in" && customerCount > 0 ? customerCount : undefined,
        });
        showSuccessToast("Sent to kitchen");
      } catch (err: any) {
        showErrorToast(err?.response?.data?.message || "Failed to send order to kitchen");
        return;
      }
    }

    // Free up the screen for the next order immediately — payment for a
    // dine-in table happens later (from Pending Orders), it shouldn't block
    // starting a new order. Also avoids a stale loadedOrderId lingering
    // across a table switch and silently merging the next table's items
    // into this one's order.
    finishWithReceipt();
  };

  const handleCheckout = async () => {
    if (!isShiftActive) {
      showErrorToast(t("Please open a shift before proceeding to checkout"));
      setIsOpenShiftDialogOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      showErrorToast(t("Cart is empty"));
      return;
    }

    // 1. If we already know the current order has a pending discount request, open awaiting dialog immediately
    if (pendingDiscountRequest && pendingDiscountRequest.status === "pending") {
      setIsAwaitingApprovalOpen(true);
      return;
    }

    // 2. Query backend to verify if this loaded order or active cart has a pending request
    try {
      const myRequests = await cashierDiscountsApi.getMyDiscountRequests();
      const activeReq = myRequests.find((r) => {
        if (r.status !== "pending") return false;
        if (!loadedOrderId) return true;
        const raw = r.orderId;
        if (typeof raw === "string") {
          return String(raw).toLowerCase() === String(loadedOrderId).toLowerCase();
        }
        if (typeof raw === "object" && raw) {
          const ids = [raw._id, raw.id, raw.orderId]
            .filter(Boolean)
            .map((x) => String(x).toLowerCase());
          return ids.includes(String(loadedOrderId).toLowerCase());
        }
        return true;
      });

      if (activeReq) {
        setPendingDiscountRequest(activeReq);
        setIsAwaitingApprovalOpen(true);
        return;
      }
    } catch (err) {
      console.error("Error checking pending discount for order:", err);
    }

    setPaymentOpen(true);
  };

  const handleCancelPendingDiscount = async () => {
    const reqId = pendingDiscountRequest?._id || pendingDiscountRequest?.id;
    if (!reqId) {
      setIsAwaitingApprovalOpen(false);
      return;
    }

    try {
      setIsCancellingDiscount(true);
      await cashierDiscountsApi.cancelDiscountRequest(reqId);
      broadcastDiscountEvent("discount_request_cancelled", {
        id: reqId,
        orderId: loadedOrderId,
      });
      showSuccessToast(t("Discount request cancelled"));
      setPendingDiscountRequest(null);
      setIsAwaitingApprovalOpen(false);
    } catch (err: any) {
      console.error("Failed to cancel discount request:", err);
      showErrorToast(
        err?.response?.data?.message || t("Failed to cancel discount request")
      );
    } finally {
      setIsCancellingDiscount(false);
    }
  };

  const handleEnsureOrderId = async (): Promise<string | null> => {
    if (loadedOrderId) return loadedOrderId;
    if (cartItems.length === 0) return null;

    if (orderType === "dine-in" && !selectedTable) {
      showErrorToast(t("Please select a table before proceeding"));
      return null;
    }

    const { createOrder } = await import("@/features/orders/api/ordersApi");
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.qty,
      price: item.unitPrice,
      notes: item.instructions || undefined,
    }));

    try {
      const created: any = await createOrder({
        type: orderType === "dine-in" ? "dine_in" : "takeaway",
        source: "pos",
        customerName: customer || "Walk-in Customer",
        customerPhone: customerPhone || undefined,
        address: orderType === "dine-in" ? resolvedTable : undefined,
        paymentMethod: "cash",
        items: orderItems,
        notes: notes || undefined,
        guestCount: orderType === "dine-in" && customerCount > 0 ? customerCount : undefined,
      });

      const createdId =
        created?.data?._id ||
        created?.data?.id ||
        created?.order?._id ||
        created?.order?.id ||
        created?._id ||
        created?.id;

      if (createdId) {
        setLoadedOrderId(createdId);
        return createdId;
      }
    } catch (err: any) {
      console.error("Failed to create order for discount:", err);
      showErrorToast(
        err?.response?.data?.message || t("Failed to create order for discount")
      );
    }
    return null;
  };

  const finishWithReceipt = (
    method: string = "cash",
    finalTotal: number = totals.total,
    discountInfo?: { name: string; value: number; discountAmount: number } | null
  ) => {
    const generatedNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedNum);
    setOrderConfirmedData({
      orderNumber: generatedNum,
      totalAmount: finalTotal,
      customerName: customer || "Walk-in Customer",
      orderType,
      selectedTable: resolvedTable,
      cartItems: [...cartItems],
      paymentMethod: method,
      guestCount: customerCount,
    });
    if (discountInfo) {
      setAppliedDiscountInfo({
        name: discountInfo.name,
        value: discountInfo.value,
        amount: discountInfo.discountAmount,
      });
    }
    setOrderConfirmedOpen(true);
  };

  const confirmPayment = async (
    method: PaymentMethod,
    discountInfo?: {
      id: string;
      name: string;
      value: number;
      discountAmount: number;
    }
  ) => {
    if (cartItems.length === 0) return;

    if (orderType === "dine-in" && !selectedTable) {
      showErrorToast(t("Please select a table before proceeding"));
      return;
    }

    const appliedDiscountAmt = discountInfo ? discountInfo.discountAmount : 0;
    const clientTotal = Math.max(0, totals.total - appliedDiscountAmt);

    const { payOrder, createOrder } = await import("@/features/orders/api/ordersApi");

    // The backend is the source of truth for the discounted total — a
    // manager-approved discount is already applied to order.total /
    // order.discountAmount server-side. Prefer those over the client-side
    // estimate so the receipt and the shift tape always match what was
    // actually charged.
    const resolveFromServerOrder = (
      resp: any
    ): {
      total: number;
      discountInfo?: { name: string; value: number; discountAmount: number };
    } => {
      const o = resp?.order || resp?.data?.order || resp?.data || resp;
      const serverTotal = Number(o?.total);
      const serverDiscountAmt = Number(o?.discountAmount);
      const hasServerTotal = Number.isFinite(serverTotal) && serverTotal >= 0;
      const hasServerDiscount = Number.isFinite(serverDiscountAmt) && serverDiscountAmt > 0;
      return {
        total: hasServerTotal ? serverTotal : clientTotal,
        discountInfo: hasServerDiscount
          ? {
              name:
                discountInfo?.name ||
                o?.discountReason ||
                t("Discount"),
              value: Number(o?.discountValue) || discountInfo?.value || 0,
              discountAmount: serverDiscountAmt,
            }
          : discountInfo,
      };
    };

    // If this is a loaded pending order → pay it via PATCH /orders/{id}/pay
    if (loadedOrderId) {
      setPendingCreatePayload({ method });
      try {
        const payResp = await payOrder(loadedOrderId, method);
        const { total: finalTotal, discountInfo: receiptDiscount } =
          resolveFromServerOrder(payResp);
        setLoadedOrderId(null);
        setPendingCreatePayload(null);
        setPaymentOpen(false);
        setShiftOrders((prev) => [...prev, { method, total: finalTotal }]);
        showSuccessToast("Payment confirmed");
        finishWithReceipt(method, finalTotal, receiptDiscount);
      } catch (err: any) {
        setPendingCreatePayload(null);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to complete order payment";
        showErrorToast(errMsg);
      }
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.qty,
      price: item.unitPrice,
      notes: item.instructions || undefined,
    }));

    // Brand new POS order: create it and pay via PATCH /orders/{id}/pay
    setPendingCreatePayload({ method });
    try {
      const created: any = await createOrder({
        type: orderType === "dine-in" ? "dine_in" : "takeaway",
        source: "pos",
        customerName: customer || "Walk-in Customer",
        customerPhone: customerPhone || undefined,
        address: orderType === "dine-in" ? resolvedTable : undefined,
        paymentMethod: method,
        items: orderItems,
        notes: notes || undefined,
        guestCount: orderType === "dine-in" && customerCount > 0 ? customerCount : undefined,
      });

      const createdId =
        created?.data?._id ||
        created?.data?.id ||
        created?.order?._id ||
        created?.order?.id ||
        created?._id ||
        created?.id;

      let payResp: any = null;
      if (createdId) {
        payResp = await payOrder(createdId, method);
      }
      const { total: finalTotal, discountInfo: receiptDiscount } =
        resolveFromServerOrder(payResp);

      setPendingCreatePayload(null);
      setPaymentOpen(false);
      setShiftOrders((prev) => [...prev, { method, total: finalTotal }]);
      showSuccessToast("Payment confirmed");
      finishWithReceipt(method, finalTotal, receiptDiscount);
    } catch (err: any) {
      setPendingCreatePayload(null);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to complete order payment";
      showErrorToast(errMsg);
    }
  };

  const confirmStaffOrder = () => {
    setSelectStaffOpen(false);
    showSuccessToast("Deducted from employee account");
    completeOrder();
  };

  const handleReceiptClose = (open: boolean) => {
    setReceiptOpen(open);
    if (!open) {
      completeOrder();
    }
  };

  // --- Sidebar actions ------------------------------------------------------

  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type);
    setSentToKitchen(false);
  };

  const payEmployeeAccount = (account: EmployeeAccount) => {
    setPayAccount(account);
    setEmployeeAccountsOpen(false);
    setPaymentRegOpen(true);
  };

  const handleConfirmPaymentRegistration = async (amount: number, method: string) => {
    const account = payAccount;
    setPaymentRegOpen(false);
    if (!account) return;

    // The backend only supports paying off a whole order at a time, so settle
    // this employee's oldest unpaid orders one by one until the entered
    // amount is used up — this is what actually deducts from what's owed,
    // instead of just showing a toast with no effect on the account.
    const backendMethod = method.toLowerCase().startsWith("cash")
      ? "cash"
      : method.toLowerCase().startsWith("mix")
        ? "mix"
        : "card";

    const { payOrder } = await import("@/features/orders/api/ordersApi");

    // Half a piaster of tolerance so paying the exact displayed "remaining"
    // total (a value that's itself a sum of floats) doesn't fail to cover
    // the last order due to binary floating-point rounding.
    const EPSILON = 0.005;
    let remainingToApply = amount;
    let settledTotal = 0;
    for (const order of account.pendingOrders) {
      if (remainingToApply + EPSILON < order.total) break;
      try {
        await payOrder(order.id, backendMethod);
        settledTotal += order.total;
        remainingToApply -= order.total;
      } catch {
        break;
      }
    }

    if (settledTotal > 0) {
      showSuccessToast(
        `Settled EGP ${settledTotal.toFixed(2)} of ${account.name}'s account (${method})`,
      );
    } else {
      showErrorToast(
        "Amount is less than the account's oldest unpaid order — nothing was settled",
      );
    }

    // Force EmployeeAccountsDialog to refetch fresh balances next time it opens.
    setEmployeeAccountsOpen(false);
  };

  const selectPendingOrder = (order: PendingOrder) => {
    setOrderType("dine-in");
    setSelectedTable(order.table);
    setSentToKitchen(true);
    setLoadedOrderId(order.id);
    if (order.items && order.items.length > 0) {
      const loadedItems = order.items.map((item) => ({
        lineId: nextLineId(),
        productId: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        qty: item.qty,
        extras: [],
        instructions: "",
      }));
      setCartItems(loadedItems);
      // These items already exist on the backend order — only items added after this count as "new"
      setSentLineIds(new Set(loadedItems.map((item) => item.lineId)));
    } else {
      setSentLineIds(new Set());
    }
    setPendingOpen(false);
  };

  const handleSelectPendingRequestOrder = async (
    orderId: string,
    item?: DiscountApprovalRequestItem
  ) => {
    try {
      if (item) {
        setPendingDiscountRequest(item);
      } else {
        cashierDiscountsApi
          .getMyDiscountRequests()
          .then((reqs) => {
            const matched = reqs.find((r) => {
              const reqOrderId =
                typeof r.orderId === "object"
                  ? r.orderId?._id || r.orderId?.id || r.orderId?.orderId
                  : r.orderId;
              return String(reqOrderId) === String(orderId);
            });
            if (matched) {
              setPendingDiscountRequest(matched);
            }
          })
          .catch((e) =>
            console.error("Failed to fetch matching discount request:", e)
          );
      }

      const res = await api.get(`/orders/${orderId}`);
      const o = res.data?.data || res.data?.order || res.data;
      if (!o) return;

      const orderTypeVal: OrderType =
        (o.type || "").toLowerCase() === "takeaway" ? "takeaway" : "dine-in";
      setOrderType(orderTypeVal);

      const tableVal =
        o.address ||
        o.customer?.address ||
        (o.tableNumber ? `Table ${o.tableNumber}` : "") ||
        "";
      if (tableVal) setSelectedTable(tableVal);

      if (o.customerCount || o.guestCount) {
        setCustomerCount(o.customerCount || o.guestCount);
      }

      setSentToKitchen(true);
      const finalOrderId = o._id || o.id || orderId;
      setLoadedOrderId(finalOrderId);

      if (!item) {
        cashierDiscountsApi
          .getMyDiscountRequests()
          .then((reqs) => {
            const matched = reqs.find((r) => {
              const reqOrderId =
                typeof r.orderId === "object"
                  ? r.orderId?._id || r.orderId?.id || r.orderId?.orderId
                  : r.orderId;
              return (
                String(reqOrderId) === String(finalOrderId) ||
                String(reqOrderId) === String(orderId)
              );
            });
            if (matched) {
              setPendingDiscountRequest(matched);
            }
          })
          .catch(() => {});
      }

      const rawItems = o.items || [];
      if (rawItems.length > 0) {
        const loadedItems = rawItems.map((item: any) => ({
          lineId: nextLineId(),
          productId:
            item.productId?._id ||
            item.product?._id ||
            String(item.productId || item.product || ""),
          name:
            item.productId?.name ||
            item.product?.name ||
            item.name ||
            "Item",
          unitPrice:
            item.price ||
            item.unitPrice ||
            item.productId?.price ||
            item.product?.price ||
            0,
          qty: item.quantity || item.qty || 1,
          extras: item.selectedExtras || [],
          instructions: item.notes || "",
        }));
        setCartItems(loadedItems);
        setSentLineIds(new Set(loadedItems.map((item: any) => item.lineId)));
      } else {
        setCartItems([]);
        setSentLineIds(new Set());
      }
      showSuccessToast(t("Order loaded into cart"));
    } catch (err) {
      console.error("Failed to load order from pending request:", err);
      showErrorToast(t("Failed to load order"));
    }
  };

  return (
    <>
      {isTableMenuOpen && (
        <div className="fixed inset-0 z-75 bg-black/50 backdrop-blur-[2px] transition-all animate-in fade-in-0 duration-200" aria-hidden="true" />
      )}

      <PosShell
        sidebar={
          <PosSidebar
            orderType={orderType}
            selectedTable={selectedTable}
            tableOptions={tableOptions}
            customerCount={customerCount}
            shiftOpen={isShiftActive}
            onOrderTypeChange={handleOrderTypeChange}
            onTableChange={handleTableChange}
            onCustomerCountChange={setCustomerCount}
            onTableMenuOpenChange={setTableMenuOpen}
            onToggleShift={() => (isShiftActive ? setIsCloseShiftDialogOpen(true) : setIsOpenShiftDialogOpen(true))}
            onOpenPendingOrders={() => setPendingOpen(true)}
            onOpenEmployeeAccounts={() => setEmployeeAccountsOpen(true)}
            onCloseRegister={() => setIsCloseShiftDialogOpen(true)}
            onBackToDashboard={() => navigate("/")}
            onSelectPendingOrder={handleSelectPendingRequestOrder}
          />
        }
        topbar={
          <PosTopbar
            search={search}
            timeLabel={timeLabel}
            onSearchChange={setSearch}
          />
        }
        cart={
          <OrderCart
            orderType={orderType}
            selectedTable={resolvedTable}
            customer={customer}
            items={cartItems}
            totals={totals}
            notes={notes}
            sentToKitchen={sentToKitchen}
            customerCount={customerCount}
            isShiftActive={isShiftActive}
            onCustomerChange={setCustomer}
            onCustomerPhoneChange={setCustomerPhone}
            onNotesChange={setNotes}
            onRemoveItem={removeItem}
            onUpdateQty={updateQty}
            onToggleExtra={toggleExtra}
            onEditItem={openEdit}
            onSendToKitchen={handleSendToKitchen}
            onCheckout={handleCheckout}
            onDeductFromEmployee={() => setSelectStaffOpen(true)}
          />
        }
      >
        <CategoryTabs
          categories={posCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="mt-5">
          <ProductGrid
            products={filteredProducts}
            cartProductIds={cartProductIds}
            onSelectProduct={openCustomize}
          />
        </div>
      </PosShell>

      <ProductCustomizeDialog
        open={isCustomizeOpen}
        product={customizeProduct}
        editLine={editingLine}
        onOpenChange={setCustomizeOpen}
        onConfirm={confirmCustomize}
      />

      <PaymentDialog
        open={isPaymentOpen}
        total={totals.total}
        isLoading={isCreatingOrder}
        orderId={loadedOrderId || undefined}
        onEnsureOrderId={handleEnsureOrderId}
        onOpenChange={setPaymentOpen}
        onConfirm={confirmPayment}
      />

      <AwaitingManagerApprovalDialog
        open={isAwaitingApprovalOpen}
        offer={pendingDiscountOffer}
        isLoading={isCancellingDiscount}
        onOpenChange={setIsAwaitingApprovalOpen}
        onCancelRequest={handleCancelPendingDiscount}
      />

      <ReceiptDialog
        open={isReceiptOpen}
        orderNumber={orderNumber}
        orderType={orderType}
        table={resolvedTable}
        items={cartItems}
        totals={totals}
        discountInfo={appliedDiscountInfo}
        onOpenChange={handleReceiptClose}
      />

      <OrderConfirmedDialog
        open={isOrderConfirmedOpen}
        onOpenChange={(open) => {
          setOrderConfirmedOpen(open);
          if (!open) completeOrder();
        }}
        orderNumber={orderConfirmedData?.orderNumber || orderNumber}
        totalAmount={orderConfirmedData?.totalAmount || totals.total}
        customerName={orderConfirmedData?.customerName || customer || "Walk-in Customer"}
        orderType={orderConfirmedData?.orderType || orderType}
        selectedTable={orderConfirmedData?.selectedTable || resolvedTable}
        cartItems={orderConfirmedData?.cartItems || cartItems}
        paymentMethod={orderConfirmedData?.paymentMethod || "cash"}
        guestCount={orderConfirmedData?.guestCount || customerCount}
        onNewOrder={completeOrder}
      />

      <SelectStaffDialog
        open={isSelectStaffOpen}
        onOpenChange={setSelectStaffOpen}
        onConfirm={confirmStaffOrder}
      />

      <EmployeeAccountsDialog
        open={isEmployeeAccountsOpen}
        onOpenChange={setEmployeeAccountsOpen}
        onPay={payEmployeeAccount}
      />

      <PaymentRegistrationDialog
        open={isPaymentRegOpen}
        account={payAccount}
        onOpenChange={setPaymentRegOpen}
        onConfirm={handleConfirmPaymentRegistration}
      />

      <PendingOrdersDialog
        open={isPendingOpen}
        onOpenChange={setPendingOpen}
        onSelectOrder={selectPendingOrder}
        onNewOrder={() => setPendingOpen(false)}
      />

      <ShiftSummaryDialog
        open={isShiftSummaryOpen}
        onOpenChange={setShiftSummaryOpen}
        shiftId={summaryShiftId}
        shiftOrders={shiftOrders}
      />

      <OpenShiftDialog
        open={isOpenShiftDialogOpen}
        isLoading={shiftsLoading.open}
        onOpenChange={setIsOpenShiftDialogOpen}
        onConfirm={handleOpenShiftConfirm}
      />

      <CloseShiftDialog
        open={isCloseShiftDialogOpen}
        isLoading={shiftsLoading.close}
        onOpenChange={setIsCloseShiftDialogOpen}
        onConfirm={handleCloseShiftConfirm}
      />
    </>
  );
};

export default PosPage;
