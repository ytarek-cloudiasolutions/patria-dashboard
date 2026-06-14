import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AdministrativeDiscountDialogProps {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
  onApply: (discount: number, reason: string) => void;
}

type DiscountMode = "fixed" | "percentage";

const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const AdministrativeDiscountDialog = ({
  open,
  total,
  onOpenChange,
  onApply,
}: AdministrativeDiscountDialogProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [mode, setMode] = useState<DiscountMode>("fixed");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setVerified(false);
      setMode("fixed");
      setAmount("");
      setReason("");
    }
  }, [open]);

  const discount = useMemo(() => {
    const value = Number(amount) || 0;
    const raw = mode === "fixed" ? value : (total * value) / 100;
    return Math.min(Math.max(raw, 0), total);
  }, [amount, mode, total]);

  const totalAfterDiscount = Math.max(total - discount, 0);
  const canApply = verified && discount > 0;

  const handleApply = () => {
    if (!canApply) return;
    onApply(discount, reason.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-[480px]"
      >
        <div className="flex flex-col px-5 py-5 sm:px-7 sm:py-6">
          <DialogTitle className="mb-5 text-[18px] font-semibold text-[#28293D] sm:text-[20px]">
            {t("Administrative discount application")}
          </DialogTitle>

          {/* Password + Check */}
          <div className="flex items-end gap-2.5">
            <InputField
              id="admin-discount-password"
              label={t("Password")}
              required
              type="password"
              placeholder="••••••••"
              wrapperClassName="flex-1"
              inputProps={{
                value: password,
                onChange: (e) => {
                  setPassword(e.target.value);
                  setVerified(false);
                },
              }}
            />
            <DefaultButton
              data={{
                buttonText: t("Check"),
                type: "button",
                icon: verified ? <ShieldCheck className="size-4" /> : undefined,
                onClick: () => setVerified(password.trim().length > 0),
                className: "sm:h-12.5",
              }}
            />
          </div>

          {/* Fixed / Percentage tabs */}
          <div className="mt-5 grid grid-cols-2 border-b border-[#E5E5E5]">
            {(
              [
                { key: "fixed", label: t("Fixed Amount (EGP)") },
                { key: "percentage", label: t("Percentage (%)") },
              ] as { key: DiscountMode; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`-mb-px h-10 cursor-pointer border-b-2 text-[14px] font-medium transition-colors ${
                  mode === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-[#8B8B8B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Amount + Reason */}
          <div className="mt-5 flex flex-col gap-4">
            <InputField
              id="admin-discount-amount"
              label={
                mode === "fixed"
                  ? t("Discount Amount (EGP)")
                  : t("Discount Percentage (%)")
              }
              required
              type="number"
              placeholder={mode === "fixed" ? t("e.g 50") : t("e.g 10")}
              inputProps={{
                value: amount,
                min: "0",
                onChange: (e) => setAmount(e.target.value),
              }}
            />
            <InputField
              id="admin-discount-reason"
              label={`${t("Reason")} (${t("Optional")})`}
              placeholder={t("e.g Loyalty Discount, compensation")}
              inputProps={{
                value: reason,
                onChange: (e) => setReason(e.target.value),
              }}
            />
          </div>

          {/* Totals */}
          <div className="mt-5 rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
            <div className="flex items-center justify-between text-[15px] font-semibold text-[#111111]">
              <span>{t("Total")}:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Separator className="my-2 bg-[#CACBD4]" />
            <div className="mt-2 flex items-center text-[13px] gap-1 text-[#8B8B8B]">
              <span>{t("Discount")}:</span>
              <span className="text-[#333333] font-semibold">
                {formatCurrency(discount)}
              </span>
            </div>
            <div className="mt-2 flex items-center text-[13px] gap-1 text-[#8B8B8B]">
              <span>{t("Total After Discount")}:</span>
              <span className="text-[#333333] font-semibold">
                {formatCurrency(totalAfterDiscount)}
              </span>
            </div>
          </div>

          <Separator className="my-5 bg-[#CACBD4]" />

          <div className="flex justify-end gap-3">
            <DefaultButton
              data={{
                buttonText: t("Cancel"),
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "border-primary text-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: t("Apply Discount"),
                type: "button",
                onClick: handleApply,
                className: canApply
                  ? ""
                  : "bg-[#dcdcdc] text-[#8b8b8b] hover:bg-[#dcdcdc] pointer-events-none",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdministrativeDiscountDialog;
