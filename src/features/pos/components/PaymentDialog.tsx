import { CreditCard, WalletCards } from "lucide-react";

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
import type { PaymentMethod } from "../types";
import { formatEgp } from "../utils";

type PaymentDialogProps = {
  open: boolean;
  method: PaymentMethod;
  transactionRef: string;
  cashAmount: string;
  cardAmount: string;
  total: number;
  onOpenChange: (open: boolean) => void;
  onMethodChange: (method: PaymentMethod) => void;
  onTransactionRefChange: (value: string) => void;
  onCashAmountChange: (value: string) => void;
  onCardAmountChange: (value: string) => void;
  onConfirm: () => void;
};

const paymentOptions: Array<{
  method: PaymentMethod;
  label: string;
  icon: typeof WalletCards;
}> = [
  { method: "cash", label: "Cash", icon: WalletCards },
  { method: "card", label: "Visa/Card", icon: CreditCard },
  { method: "mix", label: "Mix", icon: WalletCards },
];

const PaymentDialog = ({
  open,
  method,
  transactionRef,
  cashAmount,
  cardAmount,
  total,
  onOpenChange,
  onMethodChange,
  onTransactionRefChange,
  onCashAmountChange,
  onCardAmountChange,
  onConfirm,
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[620px] max-w-[calc(100%-2rem)] rounded-[8px] bg-white p-7 shadow-xl sm:max-w-[620px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold text-[#28293D]">
            Choose Payment method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-5">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.method === method;

              return (
                <button
                  key={option.method}
                  className={cn(
                    "flex h-[78px] flex-col items-center justify-center gap-2 rounded-[4px] border bg-white text-[16px] font-medium text-[#151515]",
                    isActive
                      ? "border-[#9B7200] bg-[#FBF8F2]"
                      : "border-[#DEDEDE] hover:border-[#C9AD65]"
                  )}
                  onClick={() => onMethodChange(option.method)}
                >
                  <Icon className="size-5" />
                  {option.label}
                </button>
              );
            })}
          </div>

          {method === "mix" && (
            <div className="rounded-[12px] border border-[#DADADA] p-5">
              <div className="grid grid-cols-2 gap-5">
                <label className="space-y-2">
                  <span className="text-[13px] font-semibold text-[#1F2433]">
                    Cash Amount <span className="text-[#D40000]">*</span>
                  </span>
                  <Input
                    value={cashAmount}
                    onChange={(event) =>
                      onCashAmountChange(event.target.value)
                    }
                    placeholder="0.00"
                    className="h-11 rounded-[8px] border-[#E5E2DD] px-4 focus-visible:ring-0"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-semibold text-[#1F2433]">
                    Visa Amount <span className="text-[#D40000]">*</span>
                  </span>
                  <Input
                    value={cardAmount}
                    onChange={(event) =>
                      onCardAmountChange(event.target.value)
                    }
                    placeholder="0.00"
                    className="h-11 rounded-[8px] border-[#E5E2DD] px-4 focus-visible:ring-0"
                  />
                </label>
              </div>
            </div>
          )}

          {(method === "card" || method === "mix") && (
            <label className="block space-y-2">
              <span className="text-[13px] font-semibold text-[#1F2433]">
                Transaction reference number{" "}
                <span className="text-[11px] text-[#6F7280]">(Optional)</span>
              </span>
              <Input
                value={transactionRef}
                onChange={(event) =>
                  onTransactionRefChange(event.target.value)
                }
                placeholder="e.g. TXN-123456"
                className="h-11 rounded-[8px] border-[#E5E2DD] px-4 focus-visible:ring-0"
              />
            </label>
          )}
        </div>

        <DialogFooter className="mt-1 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-6">
          <Button
            variant="outline"
            className="h-12 min-w-[104px] rounded-[4px] border-[#9B7200] bg-white text-[13px] font-semibold text-[#9B7200]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="h-12 min-w-[270px] rounded-[4px] bg-[#9B7200] text-[13px] font-semibold text-white hover:bg-[#856100]"
            onClick={onConfirm}
          >
            Confirm Payment {formatEgp(total)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
