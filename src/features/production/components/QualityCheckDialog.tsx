import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import type { QualityCheckFormData, RoastBatch } from "../types";

const FORM_ID = "quality-check-form";

const INITIAL_FORM: QualityCheckFormData = {
  outputMass: "",
  atmosphericMoisture: "",
  agtronIndex: "",
  cuppingScore: "",
};

interface QualityCheckDialogProps {
  open: boolean;
  batch: RoastBatch | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (batchId: number, data: QualityCheckFormData) => void;
}

const QualityCheckDialog = ({
  open,
  batch,
  onOpenChange,
  onConfirm,
}: QualityCheckDialogProps) => {
  const [form, setForm] = useState<QualityCheckFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QualityCheckFormData, string>>
  >({});

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [open, batch?.id]);

  const set = <K extends keyof QualityCheckFormData>(
    key: K,
    value: QualityCheckFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof QualityCheckFormData, string>> = {};
    if (!form.outputMass.trim() || Number(form.outputMass) <= 0) {
      next.outputMass = "Enter the certified output mass";
    }
    if (form.cuppingScore) {
      const score = Number(form.cuppingScore);
      if (Number.isNaN(score) || score < 0 || score > 100) {
        next.cuppingScore = "Score must be between 0 and 100";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch || !validate()) return;
    onConfirm(batch.id, form);
    onOpenChange(false);
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[560px]"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              Quality Check
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
              {/* Target card */}
              <div className="flex items-center gap-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3">
                <Badge className="h-7 rounded-[10px] bg-primary px-3 py-0 text-[12px] font-semibold text-primary-foreground">
                  {batch.batchNumber}
                </Badge>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    Active Verification Target
                  </p>
                  <p className="text-[15px] font-semibold text-[#28293D]">
                    {batch.product}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div>
                  <InputField
                    data={{
                      id: "output-mass",
                      label: {
                        htmlFor: "output-mass",
                        labelText: "Certified Output Mass (KG)",
                      },
                      placeholder: "Driver Name",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.outputMass,
                        onChange: (e) => set("outputMass", e.target.value),
                      },
                    }}
                  />
                  {errors.outputMass && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.outputMass}
                    </p>
                  )}
                </div>

                <InputField
                  data={{
                    id: "moisture",
                    label: {
                      htmlFor: "moisture",
                      labelText: "Atmospheric Moisture (%) (Optional)",
                    },
                    placeholder: "0",
                    inputProps: {
                      type: "number",
                      min: "0",
                      max: "100",
                      step: "0.01",
                      value: form.atmosphericMoisture,
                      onChange: (e) =>
                        set("atmosphericMoisture", e.target.value),
                    },
                  }}
                />

                <InputField
                  data={{
                    id: "agtron",
                    label: {
                      htmlFor: "agtron",
                      labelText: "Agtron Specular Index (Optional)",
                    },
                    placeholder: "e/g/ 582",
                    inputProps: {
                      value: form.agtronIndex,
                      onChange: (e) => set("agtronIndex", e.target.value),
                    },
                  }}
                />

                <div>
                  <InputField
                    data={{
                      id: "cupping",
                      label: {
                        htmlFor: "cupping",
                        labelText: "Total Cupping Score (0-100) (Optional)",
                      },
                      placeholder: "0",
                      inputProps: {
                        type: "number",
                        min: "0",
                        max: "100",
                        value: form.cuppingScore,
                        onChange: (e) => set("cuppingScore", e.target.value),
                      },
                    }}
                  />
                  {errors.cuppingScore && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.cuppingScore}
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
                Certify &amp; Release
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QualityCheckDialog;
