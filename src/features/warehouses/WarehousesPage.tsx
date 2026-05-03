import { useState } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import AddWarehouseModal from "./components/AddWarehouseModal";
import InternalTransferModal from "./components/InternalTransferModal";
import WarehouseCard from "./components/WarehouseCard";
import TransfersTable from "./components/TransfersTable";
import { INITIAL_WAREHOUSES, INITIAL_TRANSFERS } from "./data";
import type {
  Warehouse,
  Transfer,
  AddWarehouseFormData,
  InternalTransferFormData,
} from "./types";

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const handleAddWarehouse = (data: AddWarehouseFormData) => {
    const newWarehouse: Warehouse = {
      id: `wh-${warehouses.length + 1}`,
      ...data,
    };
    setWarehouses([...warehouses, newWarehouse]);
  };

  const handleInternalTransfer = (data: InternalTransferFormData) => {
    const sourceWarehouse = warehouses.find(
      (w) => w.id === data.sourceWarehouseId
    );
    const destinationWarehouse = warehouses.find(
      (w) => w.id === data.destinationWarehouseId
    );

    if (!sourceWarehouse || !destinationWarehouse) return;

    const newTransfer: Transfer = {
      id: `#TRF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: sourceWarehouse.name,
      to: destinationWarehouse.name,
      items: data.items.length,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
      status: "Pending",
    };

    setTransfers([newTransfer, ...transfers]);
  };

  // Group warehouses by type
  const mainWarehouses = warehouses.filter((w) => w.type === "Main Warehouse");
  const subWarehouses = warehouses.filter((w) => w.type === "Sub Warehouse");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold text-[#28293D]">Warehouses</h1>
          <p className="text-[14px] text-[#8B8B8B]">
            Manage physical storage and internal stock movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DefaultButton
            data={{
              buttonText: "Internal Transfer",
              variant: "outline",
              className:
                "border-primary text-primary hover:bg-white hover:text-primary flex items-center gap-2",
              onClick: () => setIsTransferModalOpen(true),
              icon: <ArrowLeftRight size={18} />,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Add Warehouse",
              className:
                "bg-[#9B8C14] hover:bg-[#7A6C10] flex items-center gap-2",
              onClick: () => setIsAddModalOpen(true),
              icon: <Plus size={18} />,
            }}
          />
        </div>
      </div>

      {/* Main Warehouses Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold text-[#9B8C14]">🏢</span>
          <h2 className="text-[18px] font-bold text-[#28293D]">
            Main Warehouses
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainWarehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} warehouse={warehouse} />
          ))}
        </div>
      </div>

      {/* Sub Warehouses Section */}
      {subWarehouses.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-[#1A7A45]">📦</span>
            <h2 className="text-[18px] font-bold text-[#28293D]">
              Sub Warehouses
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subWarehouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>
        </div>
      )}

      {/* Transfers Section */}
      <div className="mt-6 flex flex-col gap-4">
        <h2 className="text-[18px] font-bold text-[#28293D]">
          Recent Transfers
        </h2>
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E5E5] bg-white">
          <TransfersTable transfers={transfers} />
        </div>
      </div>

      {/* Add Warehouse Modal */}
      <AddWarehouseModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddWarehouse}
      />

      {/* Internal Transfer Modal */}
      <InternalTransferModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSave={handleInternalTransfer}
        warehouses={warehouses}
      />
    </div>
  );
};

export default WarehousesPage;
