import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";

import { cn } from "@/lib/utils";
import { ROASTING_DEGREES } from "../data";
import type { NewRoastBatchForm, RoastingDegree } from "../types";

interface NewRoastBatchModalProps {
  open: boolean;
  onClose: () => void;
  onCommit: (form: NewRoastBatchForm) => void;
}

const INITIAL_FORM: NewRoastBatchForm = {
  batchNumber: "",
  rawCoffeeType: "",
  weightBefore: 0,
  weightAfter: 0,
  degree: "Medium",
};

const NewRoastBatchModal = ({
  open,
  onClose,
  onCommit,
}: NewRoastBatchModalProps) => {
  const [form, setForm] = useState<NewRoastBatchForm>(INITIAL_FORM);

  const set = <K extends keyof NewRoastBatchForm>(
    key: K,
    value: NewRoastBatchForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommit = () => {
    if (!form.batchNumber.trim() || !form.rawCoffeeType.trim()) return;
    onCommit(form);
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
            New Roasting Batch
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "batch-number",
              label: { htmlFor: "batch-number", labelText: "Batch number" },
              placeholder: "Driver Name",
              required: true,
              inputProps: {
                value: form.batchNumber,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("batchNumber", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "raw-coffee-type",
              label: {
                htmlFor: "raw-coffee-type",
                labelText: "Raw Coffee Type",
              },
              placeholder: "+20...",
              required: true,
              inputProps: {
                value: form.rawCoffeeType,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("rawCoffeeType", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "weight-before",
              label: {
                htmlFor: "weight-before",
                labelText: "Weight before roasting (kg)",
              },
              type: "number",
              placeholder: "0",
              required: true,
              inputProps: {
                value: form.weightBefore,
                min: 0,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("weightBefore", Number(e.target.value)),
              },
            }}
          />
          <InputField
            data={{
              id: "weight-after",
              label: {
                htmlFor: "weight-after",
                labelText: "Weight after roasting (kg)",
              },
              type: "number",
              placeholder: "0",
              required: true,
              inputProps: {
                value: form.weightAfter,
                min: 0,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("weightAfter", Number(e.target.value)),
              },
            }}
          />
        </div>

        {/* Roasting Degree Toggle */}
        <div className="grid grid-cols-3 gap-2">
          {ROASTING_DEGREES.map((degree) => (
            <button
              key={degree}
              onClick={() => set("degree", degree as RoastingDegree)}
              className={cn(
                "rounded-[6px] py-3 text-[14px] font-semibold transition cursor-pointer",
                form.degree === degree
                  ? "bg-[#5C4A0E] text-white"
                  : "border border-[#E5E5E5] bg-white text-[#6B6B6B] hover:bg-[#F5F0EA]"
              )}
            >
              {degree}
            </button>
          ))}
        </div>

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
              buttonText: "Commit Batch",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleCommit,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoastBatchModal;
