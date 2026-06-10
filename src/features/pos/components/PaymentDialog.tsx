import { useEffect, useState } from "react";
import { Banknote, CreditCard, WalletCards } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PaymentMethod } from "../types";
import { formatEgp } from "../utils";

type PaymentDialogProps = {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const paymentOptions: Array<{
  method: PaymentMethod;
  label: string;
  icon: typeof WalletCards;
}> = [
  { method: "cash", label: "Cash", icon: Banknote },
  { method: "card", label: "Visa/Card", icon: CreditCard },
  { method: "mix", label: "Mix", icon: WalletCards },
];

const fieldLabel = "text-[13px] font-semibold text-[#333333]";
const fieldInput =
  "h-11 rounded-[8px] border-[#E5E2DD] px-4 text-[13px] focus-visible:ring-0";

const PaymentDialog = ({
  open,
  total,
  onOpenChange,
  onConfirm,
}: PaymentDialogProps) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setMethod("cash");
    setTransactionRef("");
    setCashAmount("");
    setCardAmount("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[600px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Choose Payment method")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.method === method;

              return (
                <button
                  key={option.method}
                  className={cn(
                    "flex h-[78px] flex-col items-center justify-center gap-2 rounded-[8px] border bg-white text-[15px] font-medium text-[#333333]",
                    isActive
                      ? "border-primary bg-[#FBF6EE]"
                      : "border-[#DEDEDE] hover:border-primary/50",
                  )}
                  onClick={() => setMethod(option.method)}
                >
                  <Icon className="size-5" />
                  {t(option.label)}
                </button>
              );
            })}
          </div>

          {method === "mix" && (
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className={fieldLabel}>
                  {t("Cash Amount")} <span className="text-[#D40000]">*</span>
                </span>
                <Input
                  value={cashAmount}
                  onChange={(event) => setCashAmount(event.target.value)}
                  placeholder="0.00"
                  className={fieldInput}
                />
              </label>
              <label className="space-y-2">
                <span className={fieldLabel}>
                  {t("Visa Amount")} <span className="text-[#D40000]">*</span>
                </span>
                <Input
                  value={cardAmount}
                  onChange={(event) => setCardAmount(event.target.value)}
                  placeholder="0.00"
                  className={fieldInput}
                />
              </label>
            </div>
          )}

          {(method === "card" || method === "mix") && (
            <label className="block space-y-2">
              <span className={fieldLabel}>
                {t("Transaction reference number")}{" "}
                <span className="text-[11px] font-normal text-[#8B8B8B]">
                  ({t("Optional")})
                </span>
              </span>
              <Input
                value={transactionRef}
                onChange={(event) => setTransactionRef(event.target.value)}
                placeholder="e.g. TXN-123456"
                className={fieldInput}
              />
            </label>
          )}
        </div>

        <DialogFooter className="mt-6 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="h-12 flex-1 rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
            onClick={onConfirm}
          >
            {t("Confirm Payment")} {formatEgp(total)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
