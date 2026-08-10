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
  onConfirm: (amount: number, method: string) => void;
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setMethod("Cash");
    setIsDropdownOpen(false);
  }, [open]);

  const handleConfirm = () => {
    const parsedAmount = parseFloat(amount) || 0;
    onConfirm(parsedAmount, method);
  };

  return (
    <>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-75 bg-black/50 backdrop-blur-[2px] transition-all animate-in fade-in-0 duration-200" aria-hidden="true" />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[696px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
        >
          <DialogHeader className="p-0">
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
              {t("Payment registration")}
            </DialogTitle>
            {account && (
              <p className="mt-1 text-[13px] font-medium text-[#595959]">
                {account.name}
              </p>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {t("Amount (EGP)")}
              </label>
              <Input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={t("Enter amount")}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {t("Payment Method")}
              </label>
              <DropdownSelect
                options={PAYMENT_REGISTRATION_METHODS}
                selected={method}
                onSelect={setMethod}
                onOpenChange={setIsDropdownOpen}
                placeholder={t("Cash")}
                align="start"
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] hover:bg-white data-[state=open]:border-[#8F6900] focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer [&_svg]:size-5"
              />
            </div>
          </div>

          {/* Separator Line & Footer */}
          <div className="w-full border-t border-[#CACBD4] pt-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="button"
                className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer"
                onClick={handleConfirm}
              >
                {t("Confirm Payment")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentRegistrationDialog;
