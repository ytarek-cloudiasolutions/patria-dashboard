import { Wallet } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { EMPLOYEE_ACCOUNTS } from "../data";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[520px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[520px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Employee accounts")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto pe-1">
          {EMPLOYEE_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="rounded-[10px] border border-[#EDEBE7] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#333333]">
                  {account.name}
                </p>
                <span className="rounded-full bg-[#FBF6EE] px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {account.daysLeft} {t("days left")}
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#8B8B8B]">
                    {t("Total")}
                  </p>
                  <p className="text-[14px] font-bold text-[#333333]">
                    {formatEgp(account.total)}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-[11px] font-medium text-[#8B8B8B]">
                    {t("Remaining")}
                  </p>
                  <p className="text-[14px] font-bold text-[#D40000]">
                    {formatEgp(account.remaining)}
                  </p>
                </div>
              </div>

              {account.payBook.length > 0 && (
                <div className="mt-3 rounded-[8px] border border-dashed border-primary/50 bg-[#FCFBF8] p-3">
                  <p className="mb-1.5 text-[11px] font-semibold text-[#595959]">
                    {t("pay book")}:
                  </p>
                  <ul className="space-y-1">
                    {account.payBook.map((entry, index) => (
                      <li
                        key={index}
                        className="text-[10px] text-[#8B8B8B]"
                      >
                        {formatEgp(entry.amount)} · {t(entry.method)} ·{" "}
                        {entry.date}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className="mt-4 h-11 w-full rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
                onClick={() => onPay(account)}
              >
                <Wallet className="size-4" />
                {t("Pay")}
              </Button>
            </div>
          ))}
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

export default EmployeeAccountsDialog;
