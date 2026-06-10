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
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { BatchFormData, RoastingDegree } from "../types";

const FORM_ID = "start-roast-form";

const INITIAL_FORM: BatchFormData = {
  batchNumber: "",
  rawCoffeeType: "",
  weightBefore: "",
  weightAfter: "",
  degree: "Medium",
};

const DEGREES: RoastingDegree[] = ["Light", "Medium", "Dark"];

interface StartRoastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: BatchFormData) => void;
}

const StartRoastDialog = ({
  open,
  onOpenChange,
  onSave,
}: StartRoastDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<BatchFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BatchFormData, string>>
  >({});

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [open]);

  const set = <K extends keyof BatchFormData>(
    key: K,
    value: BatchFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof BatchFormData, string>> = {};
    if (!form.batchNumber.trim()) next.batchNumber = t("Batch number is required");
    if (!form.rawCoffeeType.trim())
      next.rawCoffeeType = t("Raw coffee type is required");
    if (!form.weightBefore.trim() || Number(form.weightBefore) <= 0) {
      next.weightBefore = t("Enter a valid weight");
    }
    if (!form.weightAfter.trim() || Number(form.weightAfter) < 0) {
      next.weightAfter = t("Enter a valid weight");
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

                <div>
                  <InputField
                    data={{
                      id: "raw-coffee",
                      label: {
                        htmlFor: "raw-coffee",
                        labelText: t("Raw Coffee Type"),
                      },
                      placeholder: t("Raw Coffee Type"),
                      required: true,
                      inputProps: {
                        value: form.rawCoffeeType,
                        onChange: (e) => set("rawCoffeeType", e.target.value),
                      },
                    }}
                  />
                  {errors.rawCoffeeType && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.rawCoffeeType}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "weight-before",
                      label: {
                        htmlFor: "weight-before",
                        labelText: t("Weight before roasting (kg)"),
                      },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.weightBefore,
                        onChange: (e) => set("weightBefore", e.target.value),
                      },
                    }}
                  />
                  {errors.weightBefore && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.weightBefore}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "weight-after",
                      label: {
                        htmlFor: "weight-after",
                        labelText: t("Weight after roasting (kg)"),
                      },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.weightAfter,
                        onChange: (e) => set("weightAfter", e.target.value),
                      },
                    }}
                  />
                  {errors.weightAfter && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.weightAfter}
                    </p>
                  )}
                </div>
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
