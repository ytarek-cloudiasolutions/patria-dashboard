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
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: PaymentMethod) => void;
};

const paymentOptions: Array<{
  method: PaymentMethod;
  label: string;
  icon: typeof Banknote;
}> = [
  { method: "cash", label: "Cash", icon: Banknote },
  { method: "card", label: "Visa/Card", icon: CreditCard },
  { method: "mix", label: "Mix", icon: Banknote },
];

const fieldLabel = "text-[16px] font-medium text-black";
const fieldInput =
  "h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors";

const PaymentDialog = ({
  open,
  total,
  isLoading = false,
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
        className="w-[696px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Choose Payment method")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-6">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.method === method;

              return (
                <button
                  key={option.method}
                  type="button"
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-2 rounded-[5px] px-8 py-8 transition-all cursor-pointer",
                    isActive
                      ? "border-2 border-[#8F6900] bg-[#F5F0EA]"
                      : "border-2 border-[#E5E5E5] bg-[#FAFAF7]",
                  )}
                  onClick={() => setMethod(option.method)}
                >
                  <Icon className="size-6 text-black" />
                  <span
                    className={cn(
                      "text-[18px] leading-[19.26px] tracking-[0.36px] text-black",
                      isActive ? "font-bold" : "font-medium",
                    )}
                  >
                    {t(option.label)}
                  </span>
                </button>
              );
            })}
          </div>

          {method === "mix" && (
            <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-6">
              <div className="grid grid-cols-2 gap-[24px]">
                <label className="flex flex-col gap-[10px]">
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
                <label className="flex flex-col gap-[10px]">
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
            </div>
          )}

          {(method === "card" || method === "mix") && (
            <label className="flex flex-col gap-[10px]">
              <span className={fieldLabel}>
                {t("Transaction reference number")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
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

        {/* Separator Line & Footer */}
        <div className="w-full border-t border-[#CACBD4] pt-4">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer disabled:opacity-60"
              disabled={isLoading}
              onClick={() => onConfirm(method)}
            >
              <span>
                {t("Confirm Payment")}{" "}
                <span className="font-bold">EGP {total.toFixed(2)}</span>
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
