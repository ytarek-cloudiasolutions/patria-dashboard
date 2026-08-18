import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { RoastingDegree, StartRoastFormData } from "../types";

const FORM_ID = "start-roast-form";

const INITIAL_FORM: StartRoastFormData = {
  batchNumber: "",
  productId: "",
  weightIn: "",
  moistureGreen: "",
  degree: "Medium",
  notes: "",
};

const DEGREES: RoastingDegree[] = ["Light", "Medium", "Dark"];

interface StartRoastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StartRoastFormData) => void;
  productOptions: { value: string; label: string }[];
}

const StartRoastDialog = ({
  open,
  onOpenChange,
  onSave,
  productOptions,
}: StartRoastDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<StartRoastFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StartRoastFormData, string>>
  >({});
  const [isProductOpen, setIsProductOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL_FORM,
        batchNumber: `B-${Date.now().toString().slice(-6)}`,
      });
      setErrors({});
    }
  }, [open]);

  const set = <K extends keyof StartRoastFormData>(
    key: K,
    value: StartRoastFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof StartRoastFormData, string>> = {};
    if (!form.batchNumber.trim()) next.batchNumber = t("Batch number is required");
    if (!form.productId) next.productId = t("Select a product");
    if (!form.weightIn.trim() || Number(form.weightIn) <= 0) {
      next.weightIn = t("Enter a valid weight");
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
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        {isProductOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("New Roasting Batch")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <InputField
                    data={{
                      id: "batch-number",
                      label: {
                        htmlFor: "batch-number",
                        labelText: t("Batch number"),
                      },
                      placeholder: t("Batch number"),
                      required: true,
                      inputProps: {
                        value: form.batchNumber,
                        onChange: (e) => set("batchNumber", e.target.value),
                      },
                    }}
                  />
                  {errors.batchNumber && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.batchNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Product")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={productOptions}
                    selected={form.productId}
                    onSelect={(value) => set("productId", value)}
                    onOpenChange={setIsProductOpen}
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

                <div>
                  <InputField
                    data={{
                      id: "weight-in",
                      label: {
                        htmlFor: "weight-in",
                        labelText: t("Green weight in (kg)"),
                      },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.weightIn,
                        onChange: (e) => set("weightIn", e.target.value),
                      },
                    }}
                  />
                  {errors.weightIn && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.weightIn}
                    </p>
                  )}
                </div>

                <InputField
                  data={{
                    id: "moisture-green",
                    label: {
                      htmlFor: "moisture-green",
                      labelText: t("Green moisture (%) (Optional)"),
                    },
                    placeholder: "0",
                    inputProps: {
                      type: "number",
                      min: "0",
                      max: "100",
                      step: "0.01",
                      value: form.moistureGreen,
                      onChange: (e) => set("moistureGreen", e.target.value),
                    },
                  }}
                />
              </div>

              {/* Degree selector */}
              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Roasting degree")}<span className="text-[#C90000]">*</span>
                </Label>
                <div className="flex gap-6 self-stretch">
                  {DEGREES.map((d) => {
                    const selected = form.degree === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => set("degree", d)}
                        className={cn(
                          "flex grow cursor-pointer items-center justify-center gap-2 rounded px-2 py-3.5 text-[14px] transition-colors",
                          selected
                            ? "bg-[#8F6900] font-medium text-white ring-4 ring-[#624F1C1A]"
                            : "border-4 border-gray-400/40 bg-neutral-200 font-normal text-[#333333]",
                        )}
                      >
                        {t(d)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="roast-notes"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Notes (Optional)")}
                </Label>
                <Textarea
                  id="roast-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className="field-sizing-fixed resize-none rounded-xl border border-[#E5E5E5] bg-white px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
                />
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
                {t("Commit Batch")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartRoastDialog;
