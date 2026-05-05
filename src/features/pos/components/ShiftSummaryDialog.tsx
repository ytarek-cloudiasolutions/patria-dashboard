import { CreditCard, WalletCards } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SHIFT_PAYMENT_SUMMARY, SHIFT_SUMMARY } from "../data";
import type { PaymentMethod } from "../types";
import { formatEgp } from "../utils";

type ShiftSummaryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const methodIcons: Record<PaymentMethod, typeof WalletCards> = {
  cash: WalletCards,
  card: CreditCard,
  mix: WalletCards,
};

const ShiftSummaryDialog = ({
  open,
  onOpenChange,
}: ShiftSummaryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[470px] max-w-[calc(100%-2rem)] rounded-[8px] bg-white p-7 shadow-xl sm:max-w-[470px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold text-[#28293D]">
            Shift Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-7">
          <div className="flex h-[72px] items-center justify-between rounded-[10px] border border-[#D7D7D7] px-5">
            <div>
              <p className="text-[10px] font-semibold text-[#1F2433]">
                Number of Orders
              </p>
              <p className="text-[24px] font-bold leading-7 text-[#151515]">
                {SHIFT_SUMMARY.orderCount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-[#1F2433]">Total</p>
              <p className="text-[24px] font-bold leading-7 text-[#00A662]">
                {formatEgp(SHIFT_SUMMARY.total)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {SHIFT_PAYMENT_SUMMARY.map((summary) => {
              const Icon = methodIcons[summary.method];

              return (
                <div
                  key={summary.method}
                  className="flex h-[116px] flex-col items-center justify-center rounded-[4px] border border-[#DFDFDF] bg-white text-center"
                >
                  <Icon className="mb-2 size-5 text-[#151515]" />
                  <p className="text-[11px] text-[#1F2433]">
                    {summary.label}
                  </p>
                  <p className="text-[12px] font-bold text-[#151515]">
                    {formatEgp(summary.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-1 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-6">
          <Button
            variant="outline"
            className="h-12 min-w-[104px] rounded-[4px] border-[#9B7200] bg-white text-[13px] font-semibold text-[#9B7200]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftSummaryDialog;
