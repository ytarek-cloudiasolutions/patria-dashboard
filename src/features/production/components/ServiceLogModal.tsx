import { useState } from "react";
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
import { TASK_TAXONOMIES } from "../data";
import type { ServiceLogForm, TaskTaxonomy } from "../types";

interface ServiceLogModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (form: ServiceLogForm) => void;
}

const INITIAL_FORM: ServiceLogForm = {
  machineDesignation: "",
  taskTaxonomy: "Routine Sterilization",
  financialOutlay: undefined,
  nextRecalibrationDeadline: "",
};

const ServiceLogModal = ({
  open,
  onClose,
  onConfirm,
}: ServiceLogModalProps) => {
  const [form, setForm] = useState<ServiceLogForm>(INITIAL_FORM);

  const set = <K extends keyof ServiceLogForm>(
    key: K,
    value: ServiceLogForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    if (!form.machineDesignation.trim() || !form.nextRecalibrationDeadline)
      return;
    onConfirm(form);
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Equipment Service Log
          </DialogTitle>
        </DialogHeader>

        {/* Machine Designation — full width textarea */}
        <div className="flex flex-col gap-2">
          <Label className="text-[16px] font-medium text-[#000000]">
            Machine Designation <span className="text-[#C90000]">*</span>
          </Label>
          <textarea
            placeholder="e.g. Probat P05 - unit 01"
            value={form.machineDesignation}
            onChange={(e) => set("machineDesignation", e.target.value)}
            rows={3}
            className={cn(
              "w-full resize-none rounded-[12px] border border-[#E5E5E5] bg-white p-3",
              "text-[16px] text-[#23252A] placeholder:text-[#8B8B8B]",
              "outline-none focus:border-primary"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Task Taxonomy select */}
          <div className="flex flex-col gap-2">
            <Label className="text-[16px] font-medium text-[#000000]">
              Task Taxonomy <span className="text-[#C90000]">*</span>
            </Label>
            <div className="relative">
              <select
                value={form.taskTaxonomy}
                onChange={(e) =>
                  set("taskTaxonomy", e.target.value as TaskTaxonomy)
                }
                className={cn(
                  "h-12 w-full appearance-none rounded-[12px] border border-[#E5E5E5] bg-white p-3 pr-10",
                  "text-[16px] text-[#23252A] outline-none focus:border-primary"
                )}
              >
                {TASK_TAXONOMIES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
                ▾
              </span>
            </div>
          </div>

          {/* Financial Outlay */}
          <InputField
            data={{
              id: "financial-outlay",
              label: {
                htmlFor: "financial-outlay",
                labelText: "Financial Outlay (EGP)",
              },
              type: "number",
              placeholder: "0",
              inputProps: {
                value: form.financialOutlay ?? "",
                min: 0,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set(
                    "financialOutlay",
                    e.target.value ? Number(e.target.value) : undefined
                  ),
              },
            }}
          />
        </div>

        {/* Next Recalibration Deadline — full width date */}
        <InputField
          data={{
            id: "recalibration-deadline",
            label: {
              htmlFor: "recalibration-deadline",
              labelText: "Next Recalibration Deadline",
            },
            type: "date",
            placeholder: "DD/MM/YYYY",
            required: true,
            inputProps: {
              value: form.nextRecalibrationDeadline,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                set("nextRecalibrationDeadline", e.target.value),
            },
          }}
        />

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className: "border-[#E5E5E5] text-[#28293D] hover:bg-[#F8F7F4]",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Confirm Service Log",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleConfirm,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceLogModal;
