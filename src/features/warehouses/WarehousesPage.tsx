import { useMemo, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";

import WarehouseSection from "./components/WarehouseSection";
import TransfersTable from "./components/TransfersTable";
import AddWarehouseModal from "./components/AddWarehouseModal";
import InternalTransferModal from "./components/InternalTransferModal";

import { INITIAL_TRANSFERS, INITIAL_WAREHOUSES } from "./data";
import type {
  InternalTransfer,
  TransferFormState,
  Warehouse,
  WarehouseFormData,
} from "./types";

const generateShortId = () =>
  Math.random().toString(36).slice(2, 9).toUpperCase();

const generateReference = (count: number) =>
  `#TRF-${String(count + 1).padStart(6, "0")}`;

const formatDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

const WarehousesPage = () => {
  const [warehouses, setWarehouses] =
    useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [transfers, setTransfers] =
    useState<InternalTransfer[]>(INITIAL_TRANSFERS);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const { mainWarehouses, subWarehouses } = useMemo(() => {
    return {
      mainWarehouses: warehouses.filter((w) => w.kind === "Main Warehouse"),
      subWarehouses: warehouses.filter((w) => w.kind === "Sub Warehouse"),
    };
  }, [warehouses]);

  const handleAddWarehouse = (data: WarehouseFormData) => {
    const newWarehouse: Warehouse = {
      id: `wh-${Date.now()}`,
      shortId: generateShortId(),
      name: data.name.trim(),
      address: data.address.trim(),
      kind: data.kind,
    };
    setWarehouses((prev) => [...prev, newWarehouse]);
  };

  const handleCreateTransfer = (form: TransferFormState) => {
    const from = warehouses.find((w) => w.id === form.fromId);
    const to = warehouses.find((w) => w.id === form.toId);
    if (!from || !to) return;

    const items = form.items.filter(
      (item) => item.productId && item.quantity > 0,
    );
    if (items.length === 0) return;

    const newTransfer: InternalTransfer = {
      id: Date.now(),
      reference: generateReference(transfers.length),
      fromId: from.id,
      fromName: from.name,
      toId: to.id,
      toName: to.name,
      items,
      createdAt: formatDate(new Date()),
      status: "Pending",
    };
    setTransfers((prev) => [newTransfer, ...prev]);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title="Warehouses"
          description="Manage physical storage and internal stock movements."
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: "Internal Transfer",
              icon: <ArrowLeftRight className="size-4.5" />,
              onClick: () => setIsTransferOpen(true),
              className:
                "bg-[#F5F0EA] text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Add Warehouse",
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddOpen(true),
            }}
          />
        </div>
      </div>

      <WarehouseSection
        title="Main Warehouses"
        kind="Main Warehouse"
        warehouses={mainWarehouses}
      />

      <WarehouseSection
        title="Sub Warehouses"
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
