import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import PurchasingOverview from "./components/PurchasingOverview";
import PurchasingTable from "./components/PurchasingTable";
import CreatePoDialog from "./components/CreatePoDialog";
import PaymentDialog from "./components/PaymentDialog";
import {
  INITIAL_PURCHASE_ORDERS,
  PRODUCT_OPTIONS,
  PURCHASING_STATUS_FILTERS,
  SUPPLIER_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "./data";
import type { PoFormState, PoStatus, PurchaseOrder } from "./types";

const ProcurementPage = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(
    INITIAL_PURCHASE_ORDERS,
  );
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
    const supplier = SUPPLIER_OPTIONS.find((s) => s.id === form.supplierId);
    const warehouse = WAREHOUSE_OPTIONS.find((w) => w.id === form.warehouseId);
    if (!supplier || !warehouse) return;

    const total = form.items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );

    const yearMonth = new Date()
      .toISOString()
      .slice(0, 7)
      .replace("-", "");
    const number = `PO-${yearMonth}-${String(orders.length + 1).padStart(4, "0")}`;

    const items = form.items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        ...item,
        productId:
          PRODUCT_OPTIONS.find((p) => p.id === item.productId)?.id ??
          item.productId,
      }));

    const newOrder: PurchaseOrder = {
      id: Date.now(),
      poNumber: number,
      kind: "purchase order",
      supplierId: supplier.id,
      supplierName: supplier.label,
      contactEmail: supplier.email,
      warehouseId: warehouse.id,
      warehouseName: warehouse.label,
      totalAmount: total,
      paid: 0,
      status: total > 0 ? "Unpaid" : "Pending",
      expectedDeliveryDate: form.expectedDeliveryDate,
      items,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleSubmitToSupplier = (order: PurchaseOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id && o.status === "Pending"
          ? { ...o, status: "Unpaid" }
          : o,
      ),
    );
  };

  const handleConfirmPayment = (orderId: number, amount: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newPaid = o.paid + amount;
        const newStatus: PoStatus =
          newPaid >= o.totalAmount ? "Paid" : "Unpaid";
        return { ...o, paid: newPaid, status: newStatus };
      }),
    );
  };

  return (
    <>
      {isStatusFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title="Procurement & POs"
          description="Supply chain management"
        />
        <DefaultButton
          data={{
            buttonText: "Create PO",
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
            placeholder="Search by PO number or supplier..."
          />
        </div>
        <div className="sm:w-64">
          <DropdownSelect
            options={PURCHASING_STATUS_FILTERS}
            selected={statusFilter}
            onSelect={setStatusFilter}
            onOpenChange={setIsStatusFilterOpen}
            placeholder="Status"
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
