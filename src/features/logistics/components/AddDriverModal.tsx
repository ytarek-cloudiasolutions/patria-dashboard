import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";

import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import type { AddDriverFormData, DriverStatus, VehicleType } from "../types";
import { STATUS_OPTIONS, VEHICLE_TYPES } from "../data";

interface AddDriverModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddDriverFormData) => void;
}

const INITIAL_FORM: AddDriverFormData = {
  name: "",
  phone: "+20...",
  vehicle: "Motorcycle",
  status: "Active",
};

const SelectField = ({
  label,
  required,
  value,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => (
  <div className="flex flex-col">
    <Label className="mb-2.5 block text-[16px] font-medium text-[#000000]">
      {label}
      {required && <span className="ml-1 text-[#C90000]">*</span>}
    </Label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12.5 w-full appearance-none rounded-[12px] border border-[#E5E5E5] bg-white p-3 pr-10",
          "text-[16px] text-[#23252A] outline-none focus:border-primary"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
        ▾
      </span>
    </div>
  </div>
);

const AddDriverModal = ({ open, onClose, onSave }: AddDriverModalProps) => {
  const [form, setForm] = useState<AddDriverFormData>(INITIAL_FORM);

  const set = <K extends keyof AddDriverFormData>(
    key: K,
    value: AddDriverFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
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
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Add Driver
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "driver-name",
              label: { htmlFor: "driver-name", labelText: "Driver Name" },
              placeholder: "Driver Name",
              required: true,
              inputProps: {
                value: form.name,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("name", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "driver-phone",
              label: { htmlFor: "driver-phone", labelText: "Whatsapp Phone" },
              placeholder: "+20...",
              required: true,
              inputProps: {
                value: form.phone,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("phone", e.target.value),
              },
            }}
          />
          <SelectField
            label="Vehicle Type"
            required
            value={form.vehicle}
            options={VEHICLE_TYPES}
            onChange={(val) => set("vehicle", val as VehicleType)}
          />
          <SelectField
            label="Status"
            required
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={(val) => set("status", val as DriverStatus)}
          />
        </div>

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className: "border-[#E5E5E5] text-[#28293D] hover:bg-[#F8F7F4]",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Save Supplier",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleSave,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;
