import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import PurchasingOverview from "./components/PurchasingOverview";
import PurchasingTable from "./components/PurchasingTable";
import CreatePoDialog from "./components/CreatePoDialog";
import PaymentDialog from "./components/PaymentDialog";

import { usePurchasing } from "./hooks/usePurchasing";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useWarehouses } from "@/features/warehouses/hooks/useWarehouses";

import { PURCHASING_STATUS_FILTERS } from "./data";
import type { ApiPurchaseOrder } from "./store/purchasingTypes";
import type { PoFormState, PoStatus, PurchaseOrder } from "./types";

// Map backend status → UI status
const mapStatus = (s: ApiPurchaseOrder["status"]): PoStatus => {
  switch (s) {
    case "draft":
      return "Pending";
    case "submitted":
      return "Unpaid";
    case "received":
      return "Paid";
    case "cancelled":
      return "Canceled";
    default:
      return "Pending";
  }
};

// Map backend ApiPurchaseOrder → local UI PurchaseOrder
const mapOrder = (o: ApiPurchaseOrder, index: number, paidAmounts: Record<string, number>): PurchaseOrder => {
  const supplierId =
    typeof o.supplierId === "object" && o.supplierId !== null
      ? (o.supplierId as Record<string, unknown>)
      : null;
  const warehouseId =
    typeof o.warehouseId === "object" && o.warehouseId !== null
      ? (o.warehouseId as Record<string, unknown>)
      : null;

  return {
    id: index,
    poNumber: o.poNumber,
    kind: "purchase order",
    supplierId: supplierId ? String(supplierId._id ?? "") : String(o.supplierId ?? ""),
    supplierName: supplierId ? String(supplierId.name ?? "") : "",
    contactEmail: supplierId ? String(supplierId.email ?? "") : "",
    warehouseId: warehouseId ? String(warehouseId._id ?? "") : String(o.warehouseId ?? ""),
    warehouseName: warehouseId ? String(warehouseId.name ?? "") : "",
    totalAmount: o.totalAmount ?? 0,
    paid: paidAmounts[o._id] ?? 0,
    status: mapStatus(o.status),
    expectedDeliveryDate: o.createdAt?.slice(0, 10) ?? "",
    items: (o.items ?? []).map((item, i) => ({
      id: `li-${index}-${i}`,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitPrice ?? 0,
    })),
  };
};

const ProcurementPage = () => {
  const { t } = useTranslation();

  const {
    purchaseOrders,
    getPurchaseOrders,
    createPurchaseOrder,
    submitPurchaseOrder,
    cancelPurchaseOrder,
  } = usePurchasing();

  const { suppliers, getSuppliersList } = useSuppliers();
  const { products, getProducts } = useProducts();
  const { warehouses: backendWarehouses, getWarehouses } = useWarehouses();

  // Track local payment amounts keyed by backend _id (no payment API in hook)
  const [paidAmounts, setPaidAmounts] = useState<Record<string, number>>({});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    getPurchaseOrders();
    getSuppliersList({ limit: 100 });
    getProducts({ limit: 100 });
    getWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map backend orders → local UI orders
  const orders: PurchaseOrder[] = useMemo(
    () => (purchaseOrders ?? []).map((o, i) => mapOrder(o, i, paidAmounts)),
    [purchaseOrders, paidAmounts],
  );

  // Build dropdown options from real backend data
  const supplierOptions = useMemo(
    () =>
      (suppliers ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
        email: s.email,
      })),
    [suppliers],
  );

  const warehouseOptions = useMemo(
    () =>
      (backendWarehouses ?? []).map((w) => ({
        value: w._id,
        label: w.name,
      })),
    [backendWarehouses],
  );

  const productOptions = useMemo(
    () =>
      (products ?? []).map((p) => ({
        value: p.id,
        label: p.name,
        defaultCost: p.price ?? 0,
      })),
    [products],
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
      .map((item) => {
        const product = (products ?? []).find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name ?? item.productId,
          quantity: item.quantity,
          unitPrice: item.unitCost,
        };
      });

    if (!form.supplierId || !form.warehouseId || items.length === 0) return;

    createPurchaseOrder({
      supplierId: form.supplierId,
      warehouseId: form.warehouseId,
      items,
    });
  };

  const handleSubmitToSupplier = (order: PurchaseOrder) => {
    const backendOrder = (purchaseOrders ?? [])[order.id];
    if (backendOrder && backendOrder.status === "draft") {
      submitPurchaseOrder(backendOrder._id);
    }
  };

  const handleConfirmPayment = (orderId: number, amount: number) => {
    const backendOrder = (purchaseOrders ?? [])[orderId];
    if (!backendOrder) return;
    // Track payment locally (no payment API in hook)
    setPaidAmounts((prev) => ({
      ...prev,
      [backendOrder._id]: (prev[backendOrder._id] ?? 0) + amount,
    }));
  };

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
            options={PURCHASING_STATUS_FILTERS.map((o) => ({
              ...o,
              label: t(o.label),
            }))}
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
      />

      <CreatePoDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleSavePo}
        supplierOptions={supplierOptions}
        warehouseOptions={warehouseOptions}
        productOptions={productOptions}
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
