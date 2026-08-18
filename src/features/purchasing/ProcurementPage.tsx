import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import PurchasingOverview from "./components/PurchasingOverview";
import PurchasingTable from "./components/PurchasingTable";
import CreatePoDialog from "./components/CreatePoDialog";
import PaymentDialog from "./components/PaymentDialog";
import {
  PURCHASING_STATUS_FILTERS,
} from "./data";
import type {
  PoFormState,
  PoStatus,
  ProductOption,
  PurchaseOrder,
  SupplierOption,
  WarehouseOption,
} from "./types";
import { usePurchasing } from "./hooks/usePurchasing";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { useWarehouses } from "@/features/warehouses/hooks/useWarehouses";
import { useProducts } from "@/features/products/hooks/useProducts";
import {
  makePurchaseOrderPayment,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "./api/purchasingApi";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

const mapApiOrder = (o: any): PurchaseOrder => ({
  id: o._id ?? o.id,
  poNumber: o.poNumber ?? `PO-${(o._id ?? "").slice(-6).toUpperCase()}`,
  kind: "purchase order",
  // Backend model field is `supplierId`/`warehouseId` (populated in place
  // by .populate()), not `supplier`/`warehouse` — those keys never existed
  // in the response, so name/email always rendered blank for real orders.
  supplierId: o.supplierId?._id ?? o.supplierId ?? "",
  supplierName: o.supplierId?.name ?? o.supplierName ?? "",
  contactEmail: o.supplierId?.email ?? o.contactEmail ?? "",
  warehouseId: o.warehouseId?._id ?? o.warehouseId ?? "",
  warehouseName: o.warehouseId?.name ?? o.warehouseName ?? "",
  totalAmount: o.totalAmount ?? 0,
  paid: o.paidAmount ?? 0,
  status: (o.status === "received" ? "Paid" : o.status === "cancelled" ? "Canceled" : o.status === "submitted" ? "Unpaid" : "Pending") as PoStatus,
  expectedDeliveryDate: o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : "",
  items: (o.items ?? []).map((i: any) => ({
    productId: i.productId?._id ?? i.productId ?? "",
    productName: i.productId?.name ?? i.productName ?? "",
    quantity: i.quantity ?? 0,
    unitCost: i.unitPrice ?? i.unitCost ?? 0,
    unit: i.unit ?? "kg",
  })),
});

const ProcurementPage = () => {
  const { t } = useTranslation();
  const { purchaseOrders: apiOrders, getPurchaseOrders, createPurchaseOrder, submitPurchaseOrder, loading: purchasingLoading } = usePurchasing();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  // Real suppliers/warehouses/products for the Create PO dialog — it used
  // to source these from hardcoded mock ids (e.g. "bean", "arabica"), so
  // every submitted PO sent a fake, non-ObjectId id and the backend always
  // rejected it with "Supplier not found".
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { suppliers: apiSuppliers, getSuppliersList, loading: suppliersLoading } = useSuppliers() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { warehouses: apiWarehouses, getWarehouses, loading: warehousesLoading } = useWarehouses() as any;
  const { products: apiProducts, getProducts, isFetchingProducts } = useProducts();

  useEffect(() => { getPurchaseOrders(); }, [getPurchaseOrders]);
  useEffect(() => { if (apiOrders?.length) setOrders(apiOrders.map(mapApiOrder)); }, [apiOrders]);
  useEffect(() => {
    getSuppliersList();
    getWarehouses();
    getProducts({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supplierOptions: SupplierOption[] = (apiSuppliers ?? []).map((s: any) => ({
    id: s._id ?? s.id,
    label: s.name,
    email: s.email ?? "",
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const warehouseOptions: WarehouseOption[] = (apiWarehouses ?? []).map((w: any) => ({
    id: w._id ?? w.id,
    label: w.name,
  }));
  const productOptions: ProductOption[] = (apiProducts ?? []).map((p) => ({
    id: p.id,
    label: p.name,
    defaultCost: p.price ?? 0,
  }));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const [purchasingLoaded, setPurchasingLoaded] = useState(false);
  const [suppliersLoaded, setSuppliersLoaded] = useState(false);
  const [warehousesLoaded, setWarehousesLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const purchasingStarted = useRef(purchasingLoading.fetch);
  const suppliersStarted = useRef(suppliersLoading.fetch);
  const warehousesStarted = useRef(warehousesLoading.fetch);
  const productsStarted = useRef(isFetchingProducts);

  useEffect(() => {
    if (purchasingLoading.fetch) {
      purchasingStarted.current = true;
    } else if (purchasingStarted.current) {
      setPurchasingLoaded(true);
    }
  }, [purchasingLoading.fetch]);

  useEffect(() => {
    if (suppliersLoading.fetch) {
      suppliersStarted.current = true;
    } else if (suppliersStarted.current) {
      setSuppliersLoaded(true);
    }
  }, [suppliersLoading.fetch]);

  useEffect(() => {
    if (warehousesLoading.fetch) {
      warehousesStarted.current = true;
    } else if (warehousesStarted.current) {
      setWarehousesLoaded(true);
    }
  }, [warehousesLoading.fetch]);

  useEffect(() => {
    if (isFetchingProducts) {
      productsStarted.current = true;
    } else if (productsStarted.current) {
      setProductsLoaded(true);
    }
  }, [isFetchingProducts]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PurchaseOrder | null>(
    null,
  );

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((order) => {
      if (
        statusFilter !== "all" &&
        order.status !== (statusFilter as PoStatus)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        order.poNumber.toLowerCase().includes(q) ||
        order.supplierName.toLowerCase().includes(q) ||
        order.contactEmail.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const overview = useMemo(() => {
    let total = 0;
    let pending = 0;
    let received = 0;
    let canceled = 0;
    for (const order of orders) {
      total += order.totalAmount;
      if (order.status === "Pending" || order.status === "Unpaid") pending++;
      if (order.status === "Paid") received++;
      if (order.status === "Canceled") canceled++;
    }
    return { total, pending, received, canceled };
  }, [orders]);

  const handleSavePo = (form: PoFormState) => {
    const items = form.items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        productName: productOptions.find((p) => p.id === item.productId)?.label ?? "",
        quantity: item.quantity,
        // Backend reads `item.unitCost` to compute each line's subtotal
        // (purchaseController.js createPurchaseOrder) — this was sending
        // `unitPrice`, a key the backend never reads, so every PO's
        // subtotal/totalAmount silently computed as 0 regardless of what
        // unit cost was entered.
        unitCost: item.unitCost ?? 0,
      }));
    createPurchaseOrder({
      supplierId: form.supplierId,
      warehouseId: form.warehouseId,
      expectedDeliveryDate: form.expectedDeliveryDate || undefined,
      items,
    });
  };

  const handleSubmitToSupplier = (order: PurchaseOrder) => {
    submitPurchaseOrder(String(order.id));
  };

  const handleConfirmPayment = async (orderId: number, amount: number) => {
    try {
      // Was previously calling submitPurchaseOrder (POST /purchasing/:id/submit)
      // instead of the actual payment endpoint — the entered amount was
      // discarded and no payment was ever recorded against the PO.
      await makePurchaseOrderPayment(String(orderId), amount);
      showSuccessToast(t("Payment recorded"));
      getPurchaseOrders();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to record payment"));
    }
  };

  const handleMarkReceived = async (order: PurchaseOrder) => {
    try {
      await receivePurchaseOrder(String(order.id));
      showSuccessToast(t("Purchase order marked as received"));
      getPurchaseOrders();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to mark as received"));
    }
  };

  const handleCancelPo = async (order: PurchaseOrder) => {
    try {
      await cancelPurchaseOrder(String(order.id));
      showSuccessToast(t("Purchase order canceled"));
      getPurchaseOrders();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to cancel purchase order"));
    }
  };

  const isLoading = !purchasingLoaded || !suppliersLoaded || !warehousesLoaded || !productsLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <ShoppingCart className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isStatusFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Procurement & POs")}
          description={t("Supply chain management")}
        />
        <DefaultButton
          data={{
            buttonText: t("Create PO"),
            icon: <Plus className="size-4.5" />,
            onClick: () => setIsCreateOpen(true),
          }}
        />
      </div>

      <PurchasingOverview
        totalPurchases={overview.total}
        pendingRequests={overview.pending}
        requestsReceived={overview.received}
        canceled={overview.canceled}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search by PO number or supplier...")}
          />
        </div>
        <div className="sm:w-64">
          <DropdownSelect
            options={PURCHASING_STATUS_FILTERS.map((o) => ({ ...o, label: t(o.label) }))}
            selected={statusFilter}
            onSelect={setStatusFilter}
            onOpenChange={setIsStatusFilterOpen}
            placeholder={t("Status")}
            align="end"
            className="md:w-full"
            contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      <PurchasingTable
        orders={filteredOrders}
        onSubmitToSupplier={handleSubmitToSupplier}
        onMakePayment={setPaymentTarget}
        onMarkReceived={handleMarkReceived}
        onCancel={handleCancelPo}
      />

      <CreatePoDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleSavePo}
        suppliers={supplierOptions}
        warehouses={warehouseOptions}
        products={productOptions}
      />

      <PaymentDialog
        open={!!paymentTarget}
        order={paymentTarget}
        onOpenChange={(open) => !open && setPaymentTarget(null)}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
};

export default ProcurementPage;
