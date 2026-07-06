import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";

import WarehouseSection from "./components/WarehouseSection";
import TransfersTable from "./components/TransfersTable";
import AddWarehouseModal from "./components/AddWarehouseModal";
import InternalTransferModal from "./components/InternalTransferModal";

import type {
  InternalTransfer,
  TransferFormState,
  Warehouse,
  WarehouseFormData,
} from "./types";
import { useWarehouses } from "./hooks/useWarehouses";

const mapApiWarehouse = (w: any): Warehouse => ({
  id: w._id ?? w.id,
  shortId: (w._id ?? "").slice(-6).toUpperCase(),
  name: w.name ?? "",
  address: w.address ?? w.location ?? "",
  kind: w.type === "sub" ? "Sub Warehouse" : "Main Warehouse",
});

const mapApiTransfer = (t: any): InternalTransfer => ({
  id: t._id ?? t.id,
  reference: t.reference ?? `#TRF-${(t._id ?? "").slice(-6).toUpperCase()}`,
  fromId: t.fromWarehouseId?._id ?? t.fromWarehouseId ?? t.fromWarehouse?._id ?? "",
  fromName: t.fromWarehouseId?.name ?? t.fromWarehouse?.name ?? "",
  toId: t.toWarehouseId?._id ?? t.toWarehouseId ?? t.toWarehouse?._id ?? "",
  toName: t.toWarehouseId?.name ?? t.toWarehouse?.name ?? "",
  items: (t.items ?? t.products ?? []).map((p: any) => ({
    productId: p.productId ?? p.product?._id ?? "",
    productName: p.productName ?? p.product?.name ?? "",
    quantity: p.quantity ?? 0,
    unit: p.unit ?? "kg",
  })),
  createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
  status: (t.status === "approved" ? "Approved" : t.status === "completed" ? "Completed" : t.status === "rejected" ? "Rejected" : "Pending") as any,
});

const generateShortId = () =>
  Math.random().toString(36).slice(2, 9).toUpperCase();

const generateReference = (count: number) =>
  `#TRF-${String(count + 1).padStart(6, "0")}`;

const formatDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

const WarehousesPage = () => {
  const { t } = useTranslation();
  const { warehouses: apiWarehouses, transfers: apiTransfers, getWarehouses, getTransfers, createWarehouse, createTransfer } = useWarehouses();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);

  useEffect(() => { getWarehouses(); getTransfers(); }, [getWarehouses, getTransfers]);
  useEffect(() => { if (apiWarehouses?.length) setWarehouses(apiWarehouses.map(mapApiWarehouse)); }, [apiWarehouses]);
  useEffect(() => { if (apiTransfers?.length) setTransfers(apiTransfers.map(mapApiTransfer)); }, [apiTransfers]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const { mainWarehouses, subWarehouses } = useMemo(() => {
    return {
      mainWarehouses: warehouses.filter((w) => w.kind === "Main Warehouse"),
      subWarehouses: warehouses.filter((w) => w.kind === "Sub Warehouse"),
    };
  }, [warehouses]);

  const handleAddWarehouse = (data: WarehouseFormData) => {
    createWarehouse({
      name: data.name.trim(),
      address: data.address.trim(),
      type: data.kind === "Sub Warehouse" ? "sub" : "main",
    });
  };

  const handleCreateTransfer = (form: TransferFormState) => {
    const items = form.items.filter((item) => item.productId && item.quantity > 0);
    if (!form.fromId || !form.toId || items.length === 0) return;
    createTransfer({
      fromWarehouseId: form.fromId,
      toWarehouseId: form.toId,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    } as any);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Warehouses")}
          description={t("Manage physical storage and internal stock movements.")}
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: t("Internal Transfer"),
              icon: <ArrowLeftRight className="size-4.5" />,
              onClick: () => setIsTransferOpen(true),
              className:
                "bg-[#F5F0EA] text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Add Warehouse"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddOpen(true),
            }}
          />
        </div>
      </div>

      <WarehouseSection
        title={t("Main Warehouses")}
        kind="Main Warehouse"
        warehouses={mainWarehouses}
      />

      <WarehouseSection
        title={t("Sub Warehouses")}
        kind="Sub Warehouse"
        warehouses={subWarehouses}
      />

      <TransfersTable transfers={transfers} />

      <AddWarehouseModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddWarehouse}
      />

      <InternalTransferModal
        open={isTransferOpen}
        warehouses={warehouses}
        onOpenChange={setIsTransferOpen}
        onSave={handleCreateTransfer}
      />
    </>
  );
};

export default WarehousesPage;
