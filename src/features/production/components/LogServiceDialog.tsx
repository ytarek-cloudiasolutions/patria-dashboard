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
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { EQUIPMENT_TASK_OPTIONS } from "../data";
import type { EquipmentTask, ServiceLogFormData } from "../types";

const FORM_ID = "service-log-form";

const INITIAL_FORM: ServiceLogFormData = {
  machine: "",
  task: "Routine Sterilization",
  cost: "",
  deadline: "",
};

interface LogServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ServiceLogFormData) => void;
}

const LogServiceDialog = ({
  open,
  onOpenChange,
  onSave,
}: LogServiceDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ServiceLogFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ServiceLogFormData, string>>
  >({});
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsTaskOpen(false);
    }
  }, [open]);

  const set = <K extends keyof ServiceLogFormData>(
    key: K,
    value: ServiceLogFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof ServiceLogFormData, string>> = {};
    if (!form.machine.trim())
      next.machine = t("Machine designation is required");
    if (!form.deadline) next.deadline = t("Deadline is required");
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
        {isTaskOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Equipment Service Log")}
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
                  htmlFor="machine-designation"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Machine Designation")}<span className="text-[#C90000]">*</span>
                </Label>
                <Textarea
                  id="machine-designation"
                  rows={3}
                  placeholder="e.g. Probat P05 - unit 01"
                  value={form.machine}
                  onChange={(e) => set("machine", e.target.value)}
                  className={cn(
                    "field-sizing-fixed resize-none rounded-xl border border-[#E5E5E5] bg-white px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
                    errors.machine && "border-[#C90000]",
                  )}
                />
                {errors.machine && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.machine}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div className="flex flex-col">
                  <Label
                    htmlFor="task-taxonomy"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Task Taxonomy")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={EQUIPMENT_TASK_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.task}
                    onSelect={(value) =>
                      set("task", value as EquipmentTask)
                    }
                    onOpenChange={setIsTaskOpen}
                    placeholder={t("Select task")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <InputField
                  data={{
                    id: "outlay",
                    label: {
                      htmlFor: "outlay",
                      labelText: t("Financial Outlay (EGP) (Optional)"),
                    },
                    placeholder: "0",
                    inputProps: {
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: form.cost,
                      onChange: (e) => set("cost", e.target.value),
                    },
                  }}
                />
              </div>

              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Next Recalibration Deadline")}
                  <span className="text-[#C90000]">*</span>
                </Label>
                <DatePicker
                  value={form.deadline}
                  onChange={(date) => set("deadline", date)}
                  placeholder="DD/MM/YYYY"
                  withBackdrop
                  minDate={new Date().toISOString().slice(0, 10)}
                />
                {errors.deadline && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.deadline}
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
                {t("Confirm Service Log")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogServiceDialog;
