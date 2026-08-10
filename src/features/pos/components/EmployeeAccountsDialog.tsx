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

    const buildAccounts = async () => {
      const usersRes = await api.get("/users", { params: { limit: 100 } });
      const rawUsers: any[] =
        usersRes.data?.data ?? (Array.isArray(usersRes.data) ? usersRes.data : []);

      const accountsList = await Promise.all(
        rawUsers.map(async (u) => {
          const id = u._id || u.id;
          const name = u.name || u.email || "Staff Member";

          const [pendingRes, paidRes] = await Promise.all([
            api.get("/orders", {
              params: { staffId: id, paymentStatus: "pending", source: "pos", limit: 100 },
            }),
            api.get("/orders", {
              params: { staffId: id, paymentStatus: "paid", source: "pos", limit: 5 },
            }),
          ]);

          const pendingOrders: any[] =
            pendingRes.data?.data ?? pendingRes.data?.orders ?? [];
          const paidOrders: any[] = paidRes.data?.data ?? paidRes.data?.orders ?? [];

          const total = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

          const account: EmployeeAccount = {
            id,
            name,
            total,
            remaining: total,
            pendingOrders: pendingOrders.map((o) => ({ id: o._id || o.id, total: o.total || 0 })),
            payBook: paidOrders.map((o) => ({
              amount: o.total || 0,
              method: (o.paymentMethod || "cash").toLowerCase() === "card" ? "Card" : "Cash",
              date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
            })),
          };
          return account;
        }),
      );

      // Only staff who actually owe something belong on this screen.
      setAccounts(accountsList.filter((a) => a.total > 0));
    };

    buildAccounts()
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
                className="flex flex-col gap-6 rounded-[20px] border border-[#CACBD4] bg-[#FAFAF7] p-6"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-semibold tracking-[0.32px] text-black">
                    {account.name}
                  </p>
                  <div className="flex items-center justify-center rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1">
                    <span className="text-[11px] font-semibold tracking-[0.22px] text-[#C7861E]">
                      {account.pendingOrders.length > 0
                        ? `${account.pendingOrders.length} ${t("unpaid orders")}`
                        : "30 days left"}
                    </span>
                  </div>
                </div>

                {/* Totals Row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                      {t("Total")}
                    </p>
                    <p className="text-[16px] font-normal leading-[22.40px] tracking-[0.32px] text-black">
                      {formatEgp(account.total)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-end">
                    <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                      {t("Remaining")}
                    </p>
                    <p className="text-[16px] font-normal leading-[22.40px] tracking-[0.32px] text-black">
                      {formatEgp(account.remaining)}
                    </p>
                  </div>
                </div>

                {/* Pay Book History */}
                {account.payBook.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-[16px] border border-dashed border-[#8F6900] bg-[#FAFAF7] px-5 py-4">
                    <p className="text-[13px] font-medium tracking-[0.26px] text-black">
                      {t("pay book")}:
                    </p>
                    <div className="flex max-h-[120px] flex-col gap-2 overflow-y-auto pe-1">
                      {account.payBook.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-[11px] font-medium tracking-[0.22px] text-[#595959]"
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
                  <CreditCard className="size-5 text-white" />
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
