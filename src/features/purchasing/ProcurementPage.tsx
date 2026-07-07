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
import {
  PURCHASING_STATUS_FILTERS,
} from "./data";
import type { PoFormState, PoStatus, PurchaseOrder } from "./types";
import { usePurchasing } from "./hooks/usePurchasing";

const mapApiOrder = (o: any): PurchaseOrder => ({
  id: o._id ?? o.id,
  poNumber: o.poNumber ?? `PO-${(o._id ?? "").slice(-6).toUpperCase()}`,
  kind: "purchase order",
  supplierId: o.supplier?._id ?? o.supplier ?? "",
  supplierName: o.supplier?.name ?? o.supplierName ?? "",
  contactEmail: o.supplier?.email ?? o.contactEmail ?? "",
  warehouseId: o.warehouse?._id ?? o.warehouse ?? "",
  warehouseName: o.warehouse?.name ?? o.warehouseName ?? "",
  totalAmount: o.totalAmount ?? 0,
  paid: o.paidAmount ?? 0,
  status: (o.status === "received" ? "Paid" : o.status === "cancelled" ? "Canceled" : o.status === "submitted" ? "Unpaid" : "Pending") as PoStatus,
  expectedDeliveryDate: o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : "",
  items: (o.items ?? []).map((i: any) => ({
    productId: i.product?._id ?? i.product ?? i.productId ?? "",
    productName: i.product?.name ?? i.productName ?? "",
    quantity: i.quantity ?? 0,
    unitCost: i.unitPrice ?? i.unitCost ?? 0,
    unit: i.unit ?? "kg",
  })),
});

const ProcurementPage = () => {
  const { t } = useTranslation();
  const { purchaseOrders: apiOrders, getPurchaseOrders, createPurchaseOrder, submitPurchaseOrder } = usePurchasing();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => { getPurchaseOrders(); }, [getPurchaseOrders]);
  useEffect(() => { if (apiOrders?.length) setOrders(apiOrders.map(mapApiOrder)); }, [apiOrders]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

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
        productName: "",
        quantity: item.quantity,
        unitPrice: item.unitCost ?? 0,
      }));
    createPurchaseOrder({
      supplierId: form.supplierId,
      warehouseId: form.warehouseId,
      items,
    });
  };

  const handleSubmitToSupplier = (order: PurchaseOrder) => {
    submitPurchaseOrder(String(order.id));
  };

  const handleConfirmPayment = (orderId: number, _amount: number) => {
    submitPurchaseOrder(String(orderId));
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
      />

      <CreatePoDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleSavePo}
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
