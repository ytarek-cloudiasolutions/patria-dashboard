import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import {
  defaultCreateFormData,
  PRICING_RULE_TYPES,
  ADJUSTMENT_TYPES,
} from "../data";
import type {
  CreatePricingRuleDialogProps,
  CreatePricingRuleFormData,
} from "../types";

const CreatePricingRuleDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreatePricingRuleDialogProps) => {
  const [formData, setFormData] = useState<CreatePricingRuleFormData>(
    defaultCreateFormData,
  );

  const handleInputChange =
    (field: keyof CreatePricingRuleFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange =
    (field: keyof CreatePricingRuleFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData(defaultCreateFormData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(defaultCreateFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[520px] rounded-[16px] p-0 gap-0 overflow-hidden sm:max-w-174"
      >
        {/* Header */}
        <DialogHeader className="px-7 pt-7 pb-5">
          <DialogTitle className="text-[#28293D] text-[20px] font-semibold">
            Create Pricing Rule
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Row 1: Rule Name + Type */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              data={{
                id: "ruleName",
                label: { htmlFor: "ruleName", labelText: "Rule Name" },
                placeholder: "e.g. Q4 Executive Discount",
                required: true,
                inputProps: {
                  onChange: handleInputChange("ruleName"),
                  value: formData.ruleName,
                },
              }}
            />

            <div className="flex flex-col">
              <label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
                Type <span className="text-[#C90000]">*</span>
              </label>
              <DropdownSelect
                options={PRICING_RULE_TYPES}
                selected={formData.type}
                onSelect={handleSelectChange("type")}
                align="start"
                className="w-full md:w-full"
              />
            </div>
          </div>

          {/* Row 2: Adjustment Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
                Adjustment Type <span className="text-[#C90000]">*</span>
              </label>
              <DropdownSelect
                options={ADJUSTMENT_TYPES}
                selected={formData.adjustmentType}
                onSelect={handleSelectChange("adjustmentType")}
                align="start"
                className="w-full md:w-full"
              />
            </div>

            <InputField
              data={{
                id: "value",
                type: "number",
                label: {
                  htmlFor: "value",
                  labelText: "Value (Negative for Discount)",
                },
                placeholder: "••••••••••",
                required: true,
                inputProps: {
                  onChange: handleInputChange("value"),
                  value: formData.value,
                },
              }}
            />
          </div>

          {/* Row 3: Minimum Quantity — full width */}
          <InputField
            data={{
              id: "minimumQuantity",
              type: "number",
              label: {
                htmlFor: "minimumQuantity",
                labelText: "Minimum Quantity",
              },
              placeholder: "0",
              required: true,
              inputProps: {
                onChange: handleInputChange("minimumQuantity"),
                value: formData.minimumQuantity,
              },
            }}
          />
          <Separator className="bg-[#CACBD4]" />

          {/* Footer Actions */}
          <div className="flex justify-end gap-4">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: handleCancel,
                className:
                  "text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Create Strategy Rule",
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

export default CreatePricingRuleDialog;
