import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import { WAREHOUSE_TYPES } from "../data";
import type { AddWarehouseFormData, WarehouseType } from "../types";

interface AddWarehouseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddWarehouseFormData) => void;
}

const INITIAL_FORM: AddWarehouseFormData = {
  name: "",
  type: "Sub Warehouse",
  address: "",
};

const AddWarehouseModal = ({
  open,
  onClose,
  onSave,
}: AddWarehouseModalProps) => {
  const [form, setForm] = useState<AddWarehouseFormData>(INITIAL_FORM);

  const set = <K extends keyof AddWarehouseFormData>(
    key: K,
    value: AddWarehouseFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.address.trim()) return;
    onSave(form);
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="max-w-[660px] rounded-[16px] p-8 sm:max-w-174"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Add Warehouse
          </DialogTitle>
        </DialogHeader>

        {/* Row 1: Name + Type */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "warehouse-name",
              label: { htmlFor: "warehouse-name", labelText: "Warehouse Name" },
              placeholder: "e.g. Central Rpastery Hub",
              required: true,
              inputProps: {
                value: form.name,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("name", e.target.value),
              },
            }}
          />

          <div className="flex flex-col gap-2">
            <Label className="text-[16px] font-medium text-[#000000]">
              Type <span className="text-[#C90000]">*</span>
            </Label>
            <DropdownSelect
              options={WAREHOUSE_TYPES}
              selected={form.type}
              placeholder="Select type"
              align="start"
              className="w-full md:w-full"
              onSelect={(val) => set("type", val as WarehouseType)}
            />
          </div>
        </div>

        {/* Address — full width textarea */}
        <div className="flex flex-col gap-2">
          <Label className="text-[16px] font-medium text-[#000000]">
            Address <span className="text-[#C90000]">*</span>
          </Label>
          <textarea
            placeholder="Enter full physical location details..."
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            rows={4}
            className={cn(
              "w-full resize-none rounded-[12px] border border-[#E5E5E5] bg-white p-3",
              "text-[16px] text-[#23252A] placeholder:text-[#8B8B8B]",
              "outline-none focus:border-primary transition-colors"
            )}
          />
        </div>

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

export default AddWarehouseModal;
