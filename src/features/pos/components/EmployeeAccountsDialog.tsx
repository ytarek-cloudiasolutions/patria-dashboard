import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
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
import type { EmployeeAccount } from "../types";
import { formatEgp } from "../utils";

type EmployeeAccountsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPay: (account: EmployeeAccount) => void;
};

const EmployeeAccountsDialog = ({
  open,
  onOpenChange,
  onPay,
}: EmployeeAccountsDialogProps) => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<EmployeeAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    // Single server-side aggregation (GET /pos/employee-accounts) — this
    // used to be N+1 requests done entirely client-side (1 for the staff
    // list, then 2 more PER staff member), and it grouped debt by staffId
    // (whoever rang the order up) instead of billedToStaffId (who the order
    // was actually charged to), so any walk-in customer's not-yet-paid
    // ticket showed up as the cashier's own personal debt.
    api
      .get("/pos/employee-accounts")
      .then((res) => {
        const raw: any[] = res.data?.accounts ?? res.data?.data?.accounts ?? [];
        const accountsList: EmployeeAccount[] = raw.map((a) => ({
          id: a.staffId,
          name: a.staffName || "Staff Member",
          total: a.totalOwed || 0,
          remaining: a.totalOwed || 0,
          pendingOrders: (a.pendingOrders || []).map((o: any) => ({
            id: o._id || o.id,
            total: o.total || 0,
          })),
          payBook: (a.payBook || []).map((o: any) => ({
            amount: o.total || 0,
            method: (o.paymentMethod || "cash").toLowerCase() === "card" ? "Card" : "Cash",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
          })),
        }));
        // Only staff who actually owe something belong on this screen.
        setAccounts(accountsList.filter((a) => a.total > 0));
      })
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[529px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[529px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Employee accounts")}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto pe-1">
          {loading ? (
            <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
              {t("Loading staff accounts...")}
            </p>
          ) : accounts.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
              {t("No employee accounts found")}
            </p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-[#FAFAF7] px-6 py-4 outline outline-1 outline-offset-[-1px] outline-[#CACBD4]"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-semibold tracking-[0.32px] text-black">
                    {account.name}
                  </p>
                  <div className="flex items-center justify-center rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1">
                    <span className="text-xs font-semibold tracking-[0.22px] text-[#C7861E]">
                      {account.pendingOrders.length > 0
                        ? `${account.pendingOrders.length} ${t("unpaid orders")}`
                        : "30 days left"}
                    </span>
                  </div>
                </div>

                {/* Totals Row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold leading-3 tracking-[0.22px] text-black">
                      {t("Total")}
                    </p>
                    <p className="text-[16px] font-bold leading-6 tracking-[0.32px] text-black">
                      {formatEgp(account.total)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-end">
                    <p className="text-xs font-semibold leading-3 tracking-[0.22px] text-black">
                      {t("Remaining")}
                    </p>
                    <p className="text-[16px] font-bold leading-6 tracking-[0.32px] text-[#C90000]">
                      {formatEgp(account.remaining)}
                    </p>
                  </div>
                </div>

                {/* Pay Book History */}
                {account.payBook.length > 0 && (
                  <div
                    className="flex flex-col items-start gap-2 self-stretch rounded-[16px] bg-[#FAFAF7] p-3"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect x='0.75' y='0.75' width='calc(100%25 - 1.5px)' height='calc(100%25 - 1.5px)' fill='none' rx='15' ry='15' stroke='%238F6900' stroke-width='1.5' stroke-dasharray='7%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                    }}
                  >
                    <p className="text-xs font-medium tracking-[0.26px] text-black">
                      {t("pay book")}:
                    </p>
                    <div className="flex max-h-[120px] flex-col gap-2 overflow-y-auto pe-1">
                      {account.payBook.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs font-medium tracking-[0.22px] text-[#595959]"
                        >
                          <span className="inline-block size-1 shrink-0 rounded-full bg-[#595959]" />
                          <span>
                            {formatEgp(entry.amount)} - {t(entry.method)} -{" "}
                            {entry.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  type="button"
                  className="flex h-[48px] w-full items-center justify-center gap-3 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer"
                  onClick={() => onPay(account)}
                >
                  <CreditCard className="size-4 text-white" />
                  {t("Pay")}
                </Button>
              </div>
            ))
          )}
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

export default EmployeeAccountsDialog;
