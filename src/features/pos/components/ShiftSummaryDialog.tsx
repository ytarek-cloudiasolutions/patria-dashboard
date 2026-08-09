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

const methodIcons: Record<PaymentMethod, typeof WalletCards> = {
  cash: Banknote,
  card: CreditCard,
  mix: WalletCards,
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
                {loading ? "..." : summary.orderCount}
              </p>
            </div>
            <div className="text-end">
              <p className="text-[11px] font-semibold text-[#333333]">
                {t("Total")}
              </p>
              <p className="text-[24px] font-bold leading-7 text-[#00A662]">
                {loading ? "..." : formatEgp(summary.grandTotal)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {(["cash", "card", "mix"] as PaymentMethod[]).map((method) => {
              const Icon = methodIcons[method];
              return (
                <div
                  key={method}
                  className="flex h-[110px] flex-col items-center justify-center gap-1.5 rounded-[8px] border border-[#DFDFDF] bg-white text-center"
                >
                  <Icon className="size-5 text-[#333333]" />
                  <p className="text-[11px] text-[#595959]">
                    {t(METHOD_LABELS[method])}
                  </p>
                  <p className="text-[12px] font-bold text-[#333333]">
                    {loading ? "..." : formatEgp(summary.totals[method])}
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
