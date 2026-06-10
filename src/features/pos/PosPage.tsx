import { useEffect, useMemo, useState } from "react";
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

import {
  INITIAL_CART_ITEMS,
  POS_CATEGORIES,
  POS_PRODUCTS,
  nextLineId,
} from "./data";
import type {
  CartExtra,
  CartItem,
  EmployeeAccount,
  OrderType,
  PendingOrder,
  PosProduct,
} from "./types";
import { computeTotals, formatTime } from "./utils";

const DEFAULT_TABLE = "Table 3";

const PosPage = () => {
  const navigate = useNavigate();

  // Order context
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTable, setSelectedTable] = useState("");
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [sentToKitchen, setSentToKitchen] = useState(false);

  // Menu browsing
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Terminal chrome
  const [shiftOpen, setShiftOpen] = useState(false);
  const [isTableMenuOpen, setTableMenuOpen] = useState(false);
  const [timeLabel, setTimeLabel] = useState(() => formatTime(new Date()));

  // Dialogs
  const [customizeProduct, setCustomizeProduct] = useState<PosProduct | null>(
    null,
  );
  const [editingLine, setEditingLine] = useState<CartItem | null>(null);
  const [isCustomizeOpen, setCustomizeOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [isShiftSummaryOpen, setShiftSummaryOpen] = useState(false);
  const [isSelectStaffOpen, setSelectStaffOpen] = useState(false);
  const [isEmployeeAccountsOpen, setEmployeeAccountsOpen] = useState(false);
  const [isPaymentRegOpen, setPaymentRegOpen] = useState(false);
  const [payAccount, setPayAccount] = useState<EmployeeAccount | null>(null);
  const [isPendingOpen, setPendingOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const timer = window.setInterval(
      () => setTimeLabel(formatTime(new Date())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return POS_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        query.length === 0 || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const totals = useMemo(() => computeTotals(cartItems), [cartItems]);
  const cartProductIds = useMemo(
    () => cartItems.map((item) => item.productId),
    [cartItems],
  );
  const resolvedTable = selectedTable || DEFAULT_TABLE;

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
    // Synthesize a product shell so the dialog can render from the line.
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
    }

    setCustomizeOpen(false);
  };

  // --- Order completion -----------------------------------------------------

  const completeOrder = () => {
    setCartItems([]);
    setNotes("");
    setCustomer("");
    setSentToKitchen(false);
  };

  const finishWithReceipt = () => {
    setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    setReceiptOpen(true);
  };

  const handleSendToKitchen = () => setSentToKitchen(true);

  const handleCheckout = () => setPaymentOpen(true);

  const confirmPayment = () => {
    setPaymentOpen(false);
    finishWithReceipt();
  };

  const confirmStaffOrder = () => {
    setSelectStaffOpen(false);
    finishWithReceipt();
  };

  const handleReceiptClose = (open: boolean) => {
    setReceiptOpen(open);
    if (!open) completeOrder();
  };

  // --- Sidebar actions ------------------------------------------------------

  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type);
    setSentToKitchen(false);
  };

  const payEmployeeAccount = (account: EmployeeAccount) => {
    setPayAccount(account);
    setPaymentRegOpen(true);
  };

  const selectPendingOrder = (order: PendingOrder) => {
    setOrderType("dine-in");
    setSelectedTable(order.table);
    setSentToKitchen(true);
    setPendingOpen(false);
  };

  return (
    <>
      {isTableMenuOpen && (
        <div className="fixed inset-0 z-60 bg-black/35" aria-hidden="true" />
      )}

      <PosShell
        sidebar={
          <PosSidebar
            orderType={orderType}
            selectedTable={selectedTable}
            shiftOpen={shiftOpen}
            onOrderTypeChange={handleOrderTypeChange}
            onTableChange={setSelectedTable}
            onTableMenuOpenChange={setTableMenuOpen}
            onToggleShift={() => setShiftOpen((value) => !value)}
            onOpenPendingOrders={() => setPendingOpen(true)}
            onOpenEmployeeAccounts={() => setEmployeeAccountsOpen(true)}
            onCloseRegister={() => setShiftSummaryOpen(true)}
            onBackToDashboard={() => navigate("/")}
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
            onCustomerChange={setCustomer}
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
          categories={POS_CATEGORIES}
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
        onOpenChange={setPaymentOpen}
        onConfirm={confirmPayment}
      />

      <ReceiptDialog
        open={isReceiptOpen}
        orderNumber={orderNumber}
        orderType={orderType}
        table={resolvedTable}
        items={cartItems}
        totals={totals}
        onOpenChange={handleReceiptClose}
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
        onConfirm={() => setPaymentRegOpen(false)}
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
      />
    </>
  );
};

export default PosPage;
