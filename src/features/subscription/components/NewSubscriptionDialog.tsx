import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { customerOptions, productOptions, frequencyOptions } from "../data";
import type { NewSubscriptionForm } from "../types";
import { Separator } from "@/shared/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewSubscriptionForm) => void;
}

const SelectField = ({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-[#000000] text-[16px] font-medium">
      {label}
      {required && <span className="text-[#C90000] ml-1">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12.5 px-3 rounded-[12px] bg-white border border-[#E5E5E5] text-[16px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
        ▾
      </span>
    </div>
  </div>
);

const NewSubscriptionDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<NewSubscriptionForm>({
    customerId: "",
    productId: "",
    frequency: "Weekly",
    quantity: 0,
    firstDeliveryDate: "",
  });

  const handleSubmit = () => {
    onSubmit(form);
    onOpenChange(false);
    setForm({
      customerId: "",
      productId: "",
      frequency: "Weekly",
      quantity: 0,
      firstDeliveryDate: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[13px] sm:max-w-174">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#333]">
            New Subscription
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <SelectField
            label="Customer"
            required
            options={customerOptions}
            value={form.customerId}
            onChange={(v) => setForm((f) => ({ ...f, customerId: v }))}
            placeholder="Select a customer"
          />

          <SelectField
            label="Product"
            required
            options={productOptions}
            value={form.productId}
            onChange={(v) => setForm((f) => ({ ...f, productId: v }))}
            placeholder="Select a product"
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Frequency"
              required
              options={frequencyOptions}
              value={form.frequency}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  frequency: v as NewSubscriptionForm["frequency"],
                }))
              }
              placeholder="Weekly"
            />
            <div className="flex flex-col gap-2.5">
              <label className="text-[#000000] text-[16px] font-medium">
                Quantity <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                }
                placeholder="0"
                className="h-12.5 px-3 rounded-[12px] bg-white border border-[#E5E5E5] text-[16px] text-[#23252A] focus:outline-none focus:border-primary placeholder:text-[#8B8B8B]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[#000000] text-[16px] font-medium">
              First Delivery Date <span className="text-[#C90000]">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.firstDeliveryDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstDeliveryDate: e.target.value }))
                }
                placeholder="DD/MM/YYYY"
                className="w-full h-12.5 px-3 rounded-[12px] bg-white border border-[#E5E5E5] text-[16px] text-[#23252A] focus:outline-none focus:border-primary placeholder:text-[#8B8B8B]"
              />
            </div>
          </div>

          <Separator className="bg-[#CACBD4]" />

          <div className="flex justify-end gap-4">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Create Subscription",
                type: "button",
                className: "bg-[#5C4A1E]",
                onClick: handleSubmit,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSubscriptionDialog;
