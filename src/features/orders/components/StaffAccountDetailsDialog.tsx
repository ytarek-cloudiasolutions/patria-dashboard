import { useEffect, useState } from "react";
import { api } from "@/config/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { formatEgp } from "@/features/pos/utils";

type StaffOrderRow = {
  id: string;
  orderId: string;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
};

type StaffAccountDetailsDialogProps = {
  open: boolean;
  staffId: string | null;
  staffName: string;
  onOpenChange: (open: boolean) => void;
};

/**
 * Every order billed to one staff member's personal tab, paid or not —
 * /pos/employee-accounts only ever surfaces the unpaid list plus the last 10
 * paid entries (enough for the summary cards), so opening a staff member's
 * card here fetches their full history straight from GET /orders instead.
 */
const StaffAccountDetailsDialog = ({
  open,
  staffId,
  staffName,
  onOpenChange,
}: StaffAccountDetailsDialogProps) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<StaffOrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !staffId) return;
    setLoading(true);
    api
      .get("/orders", { params: { billedToStaffId: staffId, limit: 200 } })
      .then((res) => {
        const raw: any[] = res.data?.data?.orders ?? res.data?.orders ?? res.data?.data ?? [];
        const rows: StaffOrderRow[] = raw.map((o) => ({
          id: o._id || o.id,
          orderId: o.orderId || String(o._id || o.id).slice(-6).toUpperCase(),
          total: o.total || 0,
          paymentStatus: o.paymentStatus || "pending",
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt,
        }));
        setOrders(rows);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [open, staffId]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const unpaidOrders = orders.filter((o) => o.paymentStatus !== "paid");
  const paidTotal = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const remainingTotal = unpaidOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-[560px] max-w-[calc(100%-2rem)] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[560px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[20px] font-semibold tracking-[0.4px] text-black">
            {staffName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[12px] border border-[#CACBD4] bg-[#FAFAF7] p-4">
            <p className="text-[11px] font-semibold text-[#595959]">{t("Paid")}</p>
            <p className="text-[18px] font-semibold text-black">{formatEgp(paidTotal)}</p>
          </div>
          <div className="rounded-[12px] border border-[#CACBD4] bg-[#FAFAF7] p-4">
            <p className="text-[11px] font-semibold text-[#595959]">{t("Remaining")}</p>
            <p className="text-[18px] font-semibold text-[#C7861E]">{formatEgp(remainingTotal)}</p>
          </div>
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pe-1">
          {loading ? (
            <p className="py-8 text-center text-[14px] text-[#8B8B8B]">{t("Loading...")}</p>
          ) : orders.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#8B8B8B]">{t("No orders found")}</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-[10px] border border-[#E5E5E5] px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-black">#{order.orderId}</p>
                  <p className="text-[11px] text-[#8B8B8B]">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-[13px] font-semibold text-black">{formatEgp(order.total)}</p>
                  <span
                    className={
                      order.paymentStatus === "paid"
                        ? "text-[11px] font-semibold text-[#059B5A]"
                        : "text-[11px] font-semibold text-[#C7861E]"
                    }
                  >
                    {order.paymentStatus === "paid" ? t("Paid") : t("Unpaid")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end border-t border-[#CACBD4] pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-[44px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[14px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA]"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffAccountDetailsDialog;
