import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

type DiscountMode = "fixed" | "percentage";

interface AdministrativeDiscountDialogProps {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
  onApply: (
    discountType: DiscountMode,
    discountValue: number,
    password: string,
    reason: string,
  ) => void;
}

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
  const [mode, setMode] = useState<DiscountMode>("fixed");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
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
  const canApply = password.trim().length > 0 && discount > 0;

  const handleApply = () => {
    if (!canApply) return;
    onApply(mode, Number(amount) || 0, password.trim(), reason.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-6 ring-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[696px]"
      >
        <div className="flex flex-col gap-6">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Administrative discount application")}
          </DialogTitle>

          {/* Password (Full width - No Check button) */}
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="admin-discount-password"
              className="text-[16px] font-medium text-black"
            >
              {t("Password")} <span className="text-[#C90000]">*</span>
            </label>
            <input
              id="admin-discount-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Fixed Amount / Percentage Tabs */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMode("fixed")}
              className={`h-[48px] cursor-pointer border-b-2 text-center text-[16px] transition-colors ${
                mode === "fixed"
                  ? "border-primary font-medium text-[#333333]"
                  : "border-[#8B8B8B] font-semibold text-[#8B8B8B]"
              }`}
            >
              {t("Fixed Amount (EGP)")}
            </button>
            <button
              type="button"
              onClick={() => setMode("percentage")}
              className={`h-[48px] cursor-pointer border-b-2 text-center text-[16px] transition-colors ${
                mode === "percentage"
                  ? "border-primary font-medium text-[#333333]"
                  : "border-[#8B8B8B] font-semibold text-[#8B8B8B]"
              }`}
            >
              {t("Percentage (%)")}
            </button>
          </div>

          {/* Amount & Reason */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="admin-discount-amount"
                className="text-[16px] font-medium text-black"
              >
                {mode === "fixed"
                  ? t("Discount Amount (EGP)")
                  : t("Discount Percentage (%)")}{" "}
                <span className="text-[#C90000]">*</span>
              </label>
              <input
                id="admin-discount-amount"
                type="number"
                min="0"
                placeholder={mode === "fixed" ? t("e.g 50") : t("e.g 10")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="admin-discount-reason"
                className="text-[16px] font-medium text-black"
              >
                {t("Reason")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  ({t("Optional")})
                </span>
              </label>
              <input
                id="admin-discount-reason"
                type="text"
                placeholder={t("e.g Loyalty Discount, compensation")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Totals Summary Box */}
          <div className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold leading-[19.8px] text-black">
                {t("Total")}:
              </span>
              <span className="text-[18px] tracking-[0.36px] text-black">
                <span className="font-medium">EGP</span>{" "}
                <span className="font-semibold">
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
            </div>

            <div className="border-b border-[#CACBD4]" />

            <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.24px] text-[#8B8B8B]">
              <span>{t("Discount")}:</span>
              <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                {mode === "percentage"
                  ? `${amount || 0}% (${formatCurrency(discount)})`
                  : formatCurrency(discount)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.24px] text-[#8B8B8B]">
              <span>{t("Total After Discount")}:</span>
              <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                {formatCurrency(totalAfterDiscount)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-[#CACBD4] pt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-[56px] rounded-[5px] border border-primary px-[30px] py-4 text-[16px] font-semibold text-primary transition-colors hover:bg-primary/5 cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className={`h-[56px] rounded-[5px] px-[30px] py-4 text-[16px] font-semibold transition-colors ${
                canApply
                  ? "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  : "bg-primary/50 text-white cursor-not-allowed"
              }`}
            >
              {t("Apply Discount")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdministrativeDiscountDialog;
