import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import {
  SUBSCRIPTION_FREQUENCY_OPTIONS,
  SUBSCRIPTION_STATUS_OPTIONS,
} from "../data";
import type {
  ManageSubscriptionFormData,
  Subscription,
  SubscriptionFrequency,
  SubscriptionStatus,
} from "../types";

const FORM_ID = "manage-subscription-form";

const getInitial = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 1)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

interface SubscriptionManagementDialogProps {
  open: boolean;
  subscription: Subscription | null;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, data: ManageSubscriptionFormData) => void;
}

const SubscriptionManagementDialog = ({
  open,
  subscription,
  onOpenChange,
  onSave,
}: SubscriptionManagementDialogProps) => {
  const [form, setForm] = useState<ManageSubscriptionFormData>({
    status: "Active",
    frequency: "Weekly",
    quantity: "",
    nextDelivery: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ManageSubscriptionFormData, string>>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    "status" | "frequency" | null
  >(null);

  useEffect(() => {
    if (open && subscription) {
      setForm({
        status: subscription.status,
        frequency: subscription.frequency,
        quantity: String(subscription.quantity),
        nextDelivery: "",
      });
      setErrors({});
      setOpenDropdown(null);
    }
  }, [open, subscription]);

  const set = <K extends keyof ManageSubscriptionFormData>(
    key: K,
    value: ManageSubscriptionFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<
      Record<keyof ManageSubscriptionFormData, string>
    > = {};
    if (!form.quantity.trim() || Number(form.quantity) <= 0) {
      next.quantity = "Enter a valid quantity";
    }
    if (!form.nextDelivery) next.nextDelivery = "Next delivery is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription || !validate()) return;
    onSave(subscription.id, form);
    onOpenChange(false);
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        {openDropdown && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              Subscription management
            </DialogTitle>
          </div>

          {/* Body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              {/* Subscriber data card */}
              <div className="flex items-start justify-between gap-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    Subscriber data
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-[#28293D]">
                    {subscription.customerName}
                  </p>
                  <p className="text-[12px] text-[#6B6B6B]">
                    {subscription.quantity}x {subscription.productName}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-[8px] bg-primary text-[13px] font-semibold text-primary-foreground"
                >
                  {getInitial(subscription.customerName)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div className="flex flex-col">
                  <Label
                    htmlFor="status"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    Status<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={SUBSCRIPTION_STATUS_OPTIONS}
                    selected={form.status}
                    onSelect={(value) =>
                      set("status", value as SubscriptionStatus)
                    }
                    onOpenChange={(o) =>
                      setOpenDropdown(o ? "status" : null)
                    }
                    placeholder="Status"
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="frequency"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    Frequency<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={SUBSCRIPTION_FREQUENCY_OPTIONS}
                    selected={form.frequency}
                    onSelect={(value) =>
                      set("frequency", value as SubscriptionFrequency)
                    }
                    onOpenChange={(o) =>
                      setOpenDropdown(o ? "frequency" : null)
                    }
                    placeholder="Frequency"
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div>
                  <InputField
                    data={{
                      id: "quantity",
                      label: { htmlFor: "quantity", labelText: "Quantity" },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        value: form.quantity,
                        onChange: (e) => set("quantity", e.target.value),
                      },
                    }}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    Next Delivery Date
                    <span className="text-[#C90000]">*</span>
                  </Label>
                  <DatePicker
                    value={form.nextDelivery}
                    onChange={(date) => set("nextDelivery", date)}
                    placeholder="DD/MM/YYYY"
                    withBackdrop
                    minDate={new Date().toISOString().slice(0, 10)}
                  />
                  {errors.nextDelivery && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.nextDelivery}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionManagementDialog;
