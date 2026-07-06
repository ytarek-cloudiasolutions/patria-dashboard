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
import { useTranslation } from "@/shared/i18n/useTranslation";
import { ADJUSTMENT_TYPE_OPTIONS, RULE_TYPE_OPTIONS } from "../data";
import type {
  AdjustmentType,
  PricingRuleFormData,
  PricingRuleType,
} from "../types";

const FORM_ID = "create-pricing-rule-form";

const INITIAL_FORM: PricingRuleFormData = {
  name: "",
  type: "Bulk Discount",
  adjustmentType: "Percentage %",
  value: "",
  minimumQuantity: "",
};

interface CreatePricingRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PricingRuleFormData) => void;
}

const CreatePricingRuleDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreatePricingRuleDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PricingRuleFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PricingRuleFormData, string>>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    "type" | "adjustment" | null
  >(null);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setOpenDropdown(null);
    }
  }, [open]);

  const set = <K extends keyof PricingRuleFormData>(
    key: K,
    value: PricingRuleFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof PricingRuleFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Rule name is required");
    if (!form.type) next.type = t("Type is required");
    if (!form.adjustmentType) next.adjustmentType = t("Adjustment type is required");
    if (!form.value.trim()) next.value = t("Value is required");
    if (
      !form.minimumQuantity.trim() ||
      Number(form.minimumQuantity) < 0
    ) {
      next.minimumQuantity = t("Enter a valid quantity");
    }
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
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        {openDropdown && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Create Pricing Rule")}
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div>
                  <InputField
                    data={{
                      id: "rule-name",
                      label: {
                        htmlFor: "rule-name",
                        labelText: t("Rule Name"),
                      },
                      placeholder: t("e.g. Q4 Executive Discount"),
                      required: true,
                      inputProps: {
                        value: form.name,
                        onChange: (e) => set("name", e.target.value),
                      },
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="rule-type"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Type")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={RULE_TYPE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.type}
                    onSelect={(value) =>
                      set("type", value as PricingRuleType)
                    }
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "type" : null)
                    }
                    placeholder={t("Select type")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                  {errors.type && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.type}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div className="flex flex-col">
                  <Label
                    htmlFor="adjustment-type"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Adjustment Type")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={ADJUSTMENT_TYPE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.adjustmentType}
                    onSelect={(value) =>
                      set("adjustmentType", value as AdjustmentType)
                    }
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "adjustment" : null)
                    }
                    placeholder={t("Select adjustment")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                  {errors.adjustmentType && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.adjustmentType}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "value",
                      label: {
                        htmlFor: "value",
                        labelText: t("Value (Negative for Discount)"),
                      },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        step: "0.01",
                        value: form.value,
                        onChange: (e) => set("value", e.target.value),
                      },
                    }}
                  />
                  {errors.value && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.value}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <InputField
                  data={{
                    id: "minimum-quantity",
                    label: {
                      htmlFor: "minimum-quantity",
                      labelText: t("Minimum Quantity"),
                    },
                    placeholder: "0",
                    required: true,
                    inputProps: {
                      type: "number",
                      min: "0",
                      value: form.minimumQuantity,
                      onChange: (e) =>
                        set("minimumQuantity", e.target.value),
                    },
                  }}
                />
                {errors.minimumQuantity && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.minimumQuantity}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
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
                {t("Create Strategy Rule")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePricingRuleDialog;
