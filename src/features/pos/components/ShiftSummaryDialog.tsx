import { useEffect, useState, useMemo } from "react";
import { Banknote, CreditCard, WalletCards } from "lucide-react";
import { api } from "@/config/api";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PaymentMethod } from "../types";
import { formatEgp } from "../utils";

type ShiftOrder = { method: PaymentMethod; total: number };

type ShiftSummaryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftOrders?: ShiftOrder[];
  shiftId?: string | null;
  closedShift?: any;
};

const methodIcons: Record<PaymentMethod, typeof Banknote> = {
  cash: Banknote,
  card: CreditCard,
  mix: Banknote,
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Visa/Card",
  mix: "Mix",
};

const ShiftSummaryDialog = ({
  open,
  onOpenChange,
  shiftOrders = [],
  shiftId,
  closedShift,
}: ShiftSummaryDialogProps) => {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setReportData(null);
      return;
    }

    const idToFetch = shiftId || closedShift?._id || closedShift?.id;
    if (idToFetch) {
      setLoading(true);
      api
        .get(`/pos/shifts/${idToFetch}/report`)
        .then((res) => {
          setReportData(res.data?.data || res.data?.report || res.data);
        })
        .catch(() => {
          // Fallback to closedShift object if report API returns error
          setReportData(closedShift || null);
        })
        .finally(() => setLoading(false));
    } else if (closedShift) {
      setReportData(closedShift);
    }
  }, [open, shiftId, closedShift]);

  const summary = useMemo(() => {
    if (reportData) {
      const orderCount =
        reportData.orderCount ??
        reportData.totalOrders ??
        (Array.isArray(reportData.orderIds) ? reportData.orderIds.length : 0);
      const grandTotal =
        reportData.totalRevenue ??
        reportData.revenue ??
        reportData.closingBalance ??
        0;
      const totals: Record<PaymentMethod, number> = {
        cash: reportData.cashTotal ?? reportData.cash ?? 0,
        card: reportData.cardTotal ?? reportData.card ?? 0,
        mix: reportData.mixTotal ?? reportData.mix ?? 0,
      };
      return { totals, grandTotal, orderCount };
    }

    const totals: Record<PaymentMethod, number> = { cash: 0, card: 0, mix: 0 };
    let grandTotal = 0;
    for (const o of shiftOrders) {
      totals[o.method] = (totals[o.method] || 0) + o.total;
      grandTotal += o.total;
    }
    return { totals, grandTotal, orderCount: shiftOrders.length };
  }, [reportData, shiftOrders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[529px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[529px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Shift Summary")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Summary Box */}
          <div className="flex items-center justify-between rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-6 py-4">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                {t("Number of Orders")}
              </p>
              <p className="text-[24px] font-bold leading-[33.60px] tracking-[0.48px] text-black">
                {loading ? "..." : summary.orderCount}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-end">
              <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                {t("Total")}
              </p>
              <p className="text-[24px] font-bold leading-[33.60px] tracking-[0.48px] text-[#059B5A]">
                {loading ? "..." : formatEgp(summary.grandTotal)}
              </p>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="grid grid-cols-3 gap-6">
            {(["cash", "card", "mix"] as PaymentMethod[]).map((method) => {
              const Icon = methodIcons[method];
              return (
                <div
                  key={method}
                  className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[5px] border-2 border-[#E5E5E5] bg-[#FAFAF7] px-6 py-8 text-center"
                >
                  <Icon className="size-6 text-black" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[12px] font-medium leading-[12.84px] tracking-[0.24px] text-[#595959]">
                      {t(METHOD_LABELS[method])}
                    </p>
                    <p className="text-[14px] font-semibold leading-[19.60px] tracking-[0.28px] text-black">
                      {loading ? "..." : formatEgp(summary.totals[method])}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separator Line & Footer */}
        <div className="w-full border-t border-[#CACBD4] pt-4">
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftSummaryDialog;
