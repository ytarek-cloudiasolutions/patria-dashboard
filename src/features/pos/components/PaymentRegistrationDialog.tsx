import { useEffect, useState } from "react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { PAYMENT_REGISTRATION_METHODS } from "../data";
import type { EmployeeAccount } from "../types";

type PaymentRegistrationDialogProps = {
  open: boolean;
  account: EmployeeAccount | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const PaymentRegistrationDialog = ({
  open,
  account,
  onOpenChange,
  onConfirm,
}: PaymentRegistrationDialogProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setMethod("Cash");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[460px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[460px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Payment registration")}
          </DialogTitle>
          {account && (
            <p className="text-[12px] text-[#8B8B8B]">{account.name}</p>
          )}
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-[13px] font-semibold text-[#333333]">
              {t("Amount (EGP)")}
            </span>
            <Input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={t("Enter amount")}
              className="h-11 rounded-[8px] border-[#E5E2DD] px-4 text-[13px] focus-visible:ring-0"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[13px] font-semibold text-[#333333]">
              {t("Payment Method")}
            </span>
            <DropdownSelect
              options={PAYMENT_REGISTRATION_METHODS}
              selected={method}
              onSelect={setMethod}
              placeholder={t("Cash")}
              align="start"
              className="h-11 rounded-[8px] px-4 text-[13px] font-medium text-[#333333] md:w-full [&_svg]:size-5"
            />
          </label>
        </div>

        <DialogFooter className="mt-6 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="h-12 min-w-[150px] rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
            onClick={onConfirm}
          >
            {t("Create Account")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRegistrationDialog;
