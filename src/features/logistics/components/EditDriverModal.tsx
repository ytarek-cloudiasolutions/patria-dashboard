import { useState, useEffect } from "react";
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
import type { Driver, DriverStatus, VehicleType } from "../types";
import { STATUS_OPTIONS, VEHICLE_TYPES } from "../data";

interface EditDriverModalProps {
  open: boolean;
  driver: Driver | null;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}

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

const EditDriverModal = ({
  open,
  driver,
  onClose,
  onSave,
}: EditDriverModalProps) => {
  const [form, setForm] = useState<Driver | null>(null);

  useEffect(() => {
    if (driver) setForm({ ...driver });
  }, [driver]);

  if (!form) return null;

  const set = <K extends keyof Driver>(key: K, value: Driver[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Edit Driver
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "edit-driver-name",
              label: { htmlFor: "edit-driver-name", labelText: "Driver Name" },
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
              id: "edit-driver-phone",
              label: {
                htmlFor: "edit-driver-phone",
                labelText: "Whatsapp Phone",
              },
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
              onClick: onClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Save Changes",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleSave,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDriverModal;
