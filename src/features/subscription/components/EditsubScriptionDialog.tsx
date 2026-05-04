import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { EditSubscriptionForm, Subscription } from "../types";
import DefaultButton from "@/shared/components/DefaultButton";

import { statusOptions, frequencyOptions } from "../data";
import { Separator } from "@/shared/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onSubmit: (id: string, data: EditSubscriptionForm) => void;
}

const SelectField = ({
  label,
  required,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
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

const EditSubscriptionDialog = ({
  open,
  onOpenChange,
  subscription,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<EditSubscriptionForm>({
    status: "Active",
    frequency: "Weekly",
    quantity: 0,
    nextDeliveryDate: "",
  });

  useEffect(() => {
    if (subscription) {
      setForm({
        status: subscription.status,
        frequency: subscription.frequency,
        quantity: subscription.plan.quantity,
        nextDeliveryDate: "",
      });
    }
  }, [subscription]);

  if (!subscription) return null;

  const initials = subscription.customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();

  const handleSubmit = () => {
    onSubmit(subscription.id, form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[13px] sm:max-w-174">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#333]">
            Subscription management
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Subscriber card */}
          <div className="flex items-center justify-between bg-[#F5F0EA] rounded-[12px] px-4 py-3">
            <div>
              <p className="text-[11px] text-[#8B8B8B] mb-1">Subscriber data</p>
              <p className="text-[15px] font-semibold text-[#28293D]">
                {subscription.customer.name}
              </p>
              <p className="text-[13px] text-[#8B8B8B]">
                {subscription.plan.quantity}x {subscription.plan.productName}
              </p>
            </div>
            <div className="w-9 h-9 rounded-[8px] bg-[#5C4A1E] flex items-center justify-center text-white font-bold text-[14px]">
              {initials}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Status"
              required
              options={statusOptions}
              value={form.status}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  status: v as EditSubscriptionForm["status"],
                }))
              }
            />
            <SelectField
              label="Frequency"
              required
              options={frequencyOptions}
              value={form.frequency}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  frequency: v as EditSubscriptionForm["frequency"],
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-2.5">
              <label className="text-[#000000] text-[16px] font-medium">
                Next Delivery Date <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="date"
                value={form.nextDeliveryDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nextDeliveryDate: e.target.value }))
                }
                placeholder="DD/MM/YYYY"
                className="w-full h-12.5 px-3 rounded-[12px] bg-white border border-[#E5E5E5] text-[16px] text-[#23252A] focus:outline-none focus:border-primary"
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
                buttonText: "Save Changes",
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

export default EditSubscriptionDialog;
