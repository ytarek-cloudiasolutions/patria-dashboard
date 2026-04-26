import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import type { RoastBatch, QualityCheckForm } from "../types";

interface QualityCheckModalProps {
  open: boolean;
  batch: RoastBatch | null;
  onClose: () => void;
  onCertify: (batchId: string, form: QualityCheckForm) => void;
}

const INITIAL_FORM: QualityCheckForm = {
  certifiedOutputMass: 0,
  atmosphericMoisture: undefined,
  agtronSpecularIndex: "",
  totalCuppingScore: undefined,
};

const QualityCheckModal = ({
  open,
  batch,
  onClose,
  onCertify,
}: QualityCheckModalProps) => {
  const [form, setForm] = useState<QualityCheckForm>(INITIAL_FORM);

  const set = <K extends keyof QualityCheckForm>(
    key: K,
    value: QualityCheckForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCertify = () => {
    if (!batch || !form.certifiedOutputMass) return;
    onCertify(batch.id, form);
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
            Quality Check
          </DialogTitle>
        </DialogHeader>

        {/* Active Verification Target */}
        {batch && (
          <div className="flex items-center gap-4 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF8] px-4 py-3">
            <span className="rounded-[8px] bg-[#5C4A0E] px-3 py-1.5 text-[13px] font-bold text-white">
              {batch.batch}
            </span>
            <div>
              <p className="text-[11px] text-[#6B6B6B]">
                Active Verification Target
              </p>
              <p className="text-[14px] font-semibold text-[#28293D]">
                {batch.product}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "certified-output-mass",
              label: {
                htmlFor: "certified-output-mass",
                labelText: "Certified Output Mass (KG)",
              },
              type: "number",
              placeholder: "Driver Name",
              required: true,
              inputProps: {
                value: form.certifiedOutputMass || "",
                min: 0,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("certifiedOutputMass", Number(e.target.value)),
              },
            }}
          />
          <InputField
            data={{
              id: "atmospheric-moisture",
              label: {
                htmlFor: "atmospheric-moisture",
                labelText: "Atmospheric Moisture (%)",
              },
              type: "number",
              placeholder: "0",
              inputProps: {
                value: form.atmosphericMoisture ?? "",
                min: 0,
                max: 100,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set(
                    "atmosphericMoisture",
                    e.target.value ? Number(e.target.value) : undefined
                  ),
              },
              wrapperClassName: "",
            }}
          />
          <InputField
            data={{
              id: "agtron-index",
              label: {
                htmlFor: "agtron-index",
                labelText: "Agtron Specular Index",
              },
              placeholder: "e/g/ 582",
              inputProps: {
                value: form.agtronSpecularIndex ?? "",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("agtronSpecularIndex", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "cupping-score",
              label: {
                htmlFor: "cupping-score",
                labelText: "Total Cupping Score (0-100)",
              },
              type: "number",
              placeholder: "0",
              inputProps: {
                value: form.totalCuppingScore ?? "",
                min: 0,
                max: 100,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set(
                    "totalCuppingScore",
                    e.target.value ? Number(e.target.value) : undefined
                  ),
              },
            }}
          />
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
              buttonText: "Certify & Release",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleCertify,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QualityCheckModal;
