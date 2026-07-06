import { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SUBSCRIPTION_FREQUENCY_OPTIONS } from "../data";
import type {
  NewSubscriptionFormData,
  SubscriptionFrequency,
} from "../types";

const FORM_ID = "new-subscription-form";

const INITIAL_FORM: NewSubscriptionFormData = {
  customerId: "",
  productId: "",
  quantity: "",
  frequency: "Weekly",
  firstDelivery: "",
};

interface NewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: NewSubscriptionFormData) => void;
  users: { id: string; name: string; email: string }[];
  products: { id: string; name: string }[];
}

const NewSubscriptionDialog = ({
  open,
  onOpenChange,
  onSave,
  users,
  products,
}: NewSubscriptionDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<NewSubscriptionFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewSubscriptionFormData, string>>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    "customer" | "product" | "frequency" | null
  >(null);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setOpenDropdown(null);
    }
  }, [open]);

  const customerOptions = useMemo(() => {
    return users.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [users]);

  const productOptions = useMemo(() => {
    return products.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [products]);

  const set = <K extends keyof NewSubscriptionFormData>(
    key: K,
    value: NewSubscriptionFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof NewSubscriptionFormData, string>> = {};
    if (!form.customerId) next.customerId = t("Customer is required");
    if (!form.productId) next.productId = t("Product is required");
    if (!form.quantity.trim() || Number(form.quantity) <= 0) {
      next.quantity = t("Enter a valid quantity");
    }
    if (!form.firstDelivery) next.firstDelivery = t("Delivery date is required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

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
              {t("New Subscription")}
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
              <div className="flex flex-col">
                <Label
                  htmlFor="customer"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Customer")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={customerOptions}
                  selected={form.customerId}
                  onSelect={(value) => set("customerId", value)}
                  onOpenChange={(o) =>
                    setOpenDropdown(o ? "customer" : null)
                  }
                  placeholder={t("Select a customer")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
                {errors.customerId && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.customerId}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="product"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Product")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={productOptions}
                  selected={form.productId}
                  onSelect={(value) => set("productId", value)}
                  onOpenChange={(o) =>
                    setOpenDropdown(o ? "product" : null)
                  }
                  placeholder={t("Select a product")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
                {errors.productId && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.productId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div className="flex flex-col">
                  <Label
                    htmlFor="frequency"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Frequency")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={SUBSCRIPTION_FREQUENCY_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.frequency}
                    onSelect={(value) =>
                      set("frequency", value as SubscriptionFrequency)
                    }
                    onOpenChange={(o) =>
                      setOpenDropdown(o ? "frequency" : null)
                    }
                    placeholder={t("Frequency")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div>
                  <InputField
                    data={{
                      id: "quantity",
                      label: {
                        htmlFor: "quantity",
                        labelText: t("Quantity"),
                      },
                      placeholder: "e.g. 2",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "1",
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
              </div>

              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("First Delivery")}<span className="text-[#C90000]">*</span>
                </Label>
                <DatePicker
                  value={form.firstDelivery}
                  onChange={(date) => set("firstDelivery", date)}
                  placeholder="25/3/2026"
                  popoverPlacement="top-right"
                  withBackdrop
                />
                {errors.firstDelivery && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.firstDelivery}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  onClick: () => onOpenChange(false),
                  className: "border-[#CACBD4] hover:bg-[#FAFAF7]",
                }}
              />
              <Button
                type="submit"
                form={FORM_ID}
                className="h-11 rounded-[12px] bg-primary px-6 font-semibold text-white shadow-none hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-auto"
              >
                {t("Create Subscription")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSubscriptionDialog;
