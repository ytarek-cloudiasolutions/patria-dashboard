import { Banknote, CreditCard, WalletCards } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SHIFT_PAYMENT_SUMMARY, SHIFT_SUMMARY } from "../data";
import type { PaymentMethod } from "../types";
import { formatEgp } from "../utils";

type ShiftSummaryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const methodIcons: Record<PaymentMethod, typeof WalletCards> = {
  cash: Banknote,
  card: CreditCard,
  mix: WalletCards,
};

const ShiftSummaryDialog = ({
  open,
  onOpenChange,
}: ShiftSummaryDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[470px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[470px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Shift Summary")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-6">
          <div className="flex h-[72px] items-center justify-between rounded-[10px] border border-[#D7D7D7] px-5">
            <div>
              <p className="text-[11px] font-semibold text-[#333333]">
                {t("Number of Orders")}
              </p>
              <p className="text-[24px] font-bold leading-7 text-[#333333]">
                {SHIFT_SUMMARY.orderCount}
              </p>
            </div>
            <div className="text-end">
              <p className="text-[11px] font-semibold text-[#333333]">
                {t("Total")}
              </p>
              <p className="text-[24px] font-bold leading-7 text-[#00A662]">
                {formatEgp(SHIFT_SUMMARY.total)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {SHIFT_PAYMENT_SUMMARY.map((summary) => {
              const Icon = methodIcons[summary.method];

              return (
                <div
                  key={summary.method}
                  className="flex h-[110px] flex-col items-center justify-center gap-1.5 rounded-[8px] border border-[#DFDFDF] bg-white text-center"
                >
                  <Icon className="size-5 text-[#333333]" />
                  <p className="text-[11px] text-[#595959]">
                    {t(summary.label)}
                  </p>
                  <p className="text-[12px] font-bold text-[#333333]">
                    {formatEgp(summary.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-6 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftSummaryDialog;
