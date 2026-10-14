import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
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
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { payOrder } from "@/features/orders/api/ordersApi";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import PaymentRegistrationDialog from "@/features/pos/components/PaymentRegistrationDialog";
import type { EmployeeAccount } from "@/features/pos/types";

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
 * Settling a balance here (any amount, not just a single order) is
 * restricted to super admins — same destructive-money-movement bar as the
 * rest of the dashboard's financial actions.
 */
const StaffAccountDetailsDialog = ({
  open,
  staffId,
  staffName,
  onOpenChange,
}: StaffAccountDetailsDialogProps) => {
  const { t } = useTranslation();
  const { isSuperAdmin } = usePermissions();
  const [orders, setOrders] = useState<StaffOrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const fetchOrders = () => {
    if (!staffId) return;
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
  };

  useEffect(() => {
    if (!open || !staffId) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, staffId]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const unpaidOrders = orders.filter((o) => o.paymentStatus !== "paid");
  const paidTotal = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const remainingTotal = unpaidOrders.reduce((sum, o) => sum + o.total, 0);

  const pseudoAccount: EmployeeAccount = {
    id: staffId || "",
    name: staffName,
    total: remainingTotal,
    remaining: remainingTotal,
    pendingOrders: [...unpaidOrders]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((o) => ({ id: o.id, total: o.total })),
    payBook: [],
  };

  const handleConfirmPayment = async (amount: number, method: string) => {
    setIsPaymentOpen(false);
    const backendMethod = method.toLowerCase().startsWith("cash")
      ? "cash"
      : method.toLowerCase().startsWith("mix")
        ? "mix"
        : "card";

    // Oldest-first, same FIFO settlement rule used everywhere else balances
    // are paid off — the backend only supports paying a whole order at once.
    const EPSILON = 0.005;
    let remainingToApply = amount;
    let settledTotal = 0;
    for (const order of pseudoAccount.pendingOrders) {
      if (remainingToApply + EPSILON < order.total) break;
      try {
        await payOrder(order.id, backendMethod);
        settledTotal += order.total;
        remainingToApply -= order.total;
      } catch {
        break;
      }
    }

    if (settledTotal > 0) {
      showSuccessToast(`Settled EGP ${settledTotal.toFixed(2)} of ${staffName}'s account (${method})`);
      fetchOrders();
    } else {
      showErrorToast("Amount is less than the account's oldest unpaid order — nothing was settled");
    }
  };

  return (
    <>
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

          <div className="flex items-center justify-between gap-4 border-t border-[#CACBD4] pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-[44px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[14px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA]"
              onClick={() => onOpenChange(false)}
            >
              {t("Close")}
            </Button>
            {/* Settling any amount of someone else's tab is a super-admin-only
                action — a regular staff/cashier role can still pay off a
                single order at checkout in the POS itself. */}
            {isSuperAdmin && remainingTotal > 0 && (
              <Button
                type="button"
                className="flex h-[44px] items-center gap-2 px-6 rounded-[5px] bg-[#8F6900] text-[14px] font-semibold text-white hover:bg-[#8F6900]/90"
                onClick={() => setIsPaymentOpen(true)}
              >
                <CreditCard className="size-4" />
                {t("Pay")}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PaymentRegistrationDialog
        open={isPaymentOpen}
        account={pseudoAccount}
        onOpenChange={setIsPaymentOpen}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
};

export default StaffAccountDetailsDialog;
