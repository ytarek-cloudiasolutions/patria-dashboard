import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import { PRODUCT_SKU_OPTIONS } from "../data";
import type {
  InternalTransferFormData,
  Warehouse,
  TransferItem,
} from "../types";

interface InternalTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: InternalTransferFormData) => void;
  warehouses: Warehouse[];
}

const INITIAL_ITEM: TransferItem = {
  id: "",
  productSku: "",
  quantity: 0,
};

const InternalTransferModal = ({
  open,
  onClose,
  onSave,
  warehouses,
}: InternalTransferModalProps) => {
  const [form, setForm] = useState<InternalTransferFormData>({
    sourceWarehouseId: "",
    destinationWarehouseId: "",
    items: [],
  });
  const [currentItem, setCurrentItem] = useState<TransferItem>(INITIAL_ITEM);

  const set = <K extends keyof InternalTransferFormData>(
    key: K,
    value: InternalTransferFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const setCurrentItemField = <K extends keyof TransferItem>(
    key: K,
    value: TransferItem[K]
  ) => setCurrentItem((prev) => ({ ...prev, [key]: value }));

  // Get main warehouses only
  const mainWarehouses = warehouses.filter((w) => w.type === "Main Warehouse");

  // Get destination warehouses (all except source)
  const destinationWarehouses = warehouses.filter(
    (w) => w.id !== form.sourceWarehouseId
  );

  const handleAddItem = () => {
    if (!currentItem.productSku || currentItem.quantity <= 0) return;

    const newItem: TransferItem = {
      id: `item-${Date.now()}`,
      productSku: currentItem.productSku,
      quantity: currentItem.quantity,
    };

    setForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem(INITIAL_ITEM);
  };

  const handleRemoveItem = (itemId: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSave = () => {
    if (
      !form.sourceWarehouseId ||
      !form.destinationWarehouseId ||
      form.items.length === 0
    ) {
      return;
    }
    onSave(form);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setForm({
      sourceWarehouseId: "",
      destinationWarehouseId: "",
      items: [],
    });
    setCurrentItem(INITIAL_ITEM);
  };

  const getSKULabel = (sku: string) => {
    const option = PRODUCT_SKU_OPTIONS.find((opt) => opt.value === sku);
    return option?.label || sku;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="max-w-165 rounded-[16px] p-8 sm:max-w-174"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Add Warehouse
          </DialogTitle>
        </DialogHeader>

        {/* Row 1: Source + Destination */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-[16px] font-medium text-[#000000]">
              Source <span className="text-[#C90000]">*</span>
            </Label>
            <DropdownSelect
              options={mainWarehouses.map((w) => w.name)}
              selected={
                mainWarehouses.find((w) => w.id === form.sourceWarehouseId)
                  ?.name || ""
              }
              placeholder="Select source location"
              align="start"
              className="w-full"
              onSelect={(val) => {
                const warehouse = mainWarehouses.find((w) => w.name === val);
                if (warehouse) set("sourceWarehouseId", warehouse.id);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[16px] font-medium text-[#000000]">
              Destination <span className="text-[#C90000]">*</span>
            </Label>
            <DropdownSelect
              options={destinationWarehouses.map((w) => w.name)}
              selected={
                destinationWarehouses.find(
                  (w) => w.id === form.destinationWarehouseId
                )?.name || ""
              }
              placeholder="Select target location"
              align="start"
              className="w-full"
              onSelect={(val) => {
                const warehouse = destinationWarehouses.find(
                  (w) => w.name === val
                );
                if (warehouse) set("destinationWarehouseId", warehouse.id);
              }}
            />
          </div>
        </div>

        {/* Items Section Header */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[16px] font-semibold text-[#28293D]">
            📦 Items to tranfer
          </span>
        </div>

        {/* Current Item Input Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#000000]">
              Product <span className="text-[#C90000]">*</span>
            </Label>
            <DropdownSelect
              options={PRODUCT_SKU_OPTIONS.map((opt) => opt.label)}
              selected={getSKULabel(currentItem.productSku)}
              placeholder="Select SKU"
              align="start"
              className="w-full"
              onSelect={(val) => {
                const option = PRODUCT_SKU_OPTIONS.find(
                  (opt) => opt.label === val
                );
                if (option) setCurrentItemField("productSku", option.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#000000]">
              Quantity <span className="text-[#C90000]">*</span>
            </Label>
            <input
              type="number"
              placeholder="0"
              value={currentItem.quantity || ""}
              onChange={(e) =>
                setCurrentItemField("quantity", parseInt(e.target.value) || 0)
              }
              className={cn(
                "w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3 py-2.5",
                "text-[16px] text-[#23252A] placeholder:text-[#8B8B8B]",
                "outline-none focus:border-primary transition-colors"
              )}
            />
          </div>
        </div>

        {/* Add Items Button */}
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 text-[14px] font-semibold text-[#9B8C14] hover:text-[#7A6C10] transition-colors"
        >
          <Plus size={16} />
          Add Items
        </button>

        {/* Added Items List */}
        {form.items.length > 0 && (
          <div className="flex flex-col gap-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF8] p-4">
            {form.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[8px] bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#28293D]">
                    {getSKULabel(item.productSku)}
                  </span>
                  <span className="text-[14px] text-[#8B8B8B]">
                    Qty: {item.quantity}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-[#C90000] hover:text-[#A70000] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className:
                "border-primary text-primary hover:bg-white hover:text-primary",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Create Warehouse",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleSave,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternalTransferModal;
