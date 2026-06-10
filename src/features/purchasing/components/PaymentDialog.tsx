import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { cn } from "@/lib/utils";
import type { PurchaseOrder } from "../types";

const FORM_ID = "po-payment-form";

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

interface PaymentDialogProps {
  open: boolean;
  order: PurchaseOrder | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (orderId: number, amount: number) => void;
}

const PaymentDialog = ({
  open,
  order,
  onOpenChange,
  onConfirm,
}: PaymentDialogProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const remaining = order ? Math.max(0, order.totalAmount - order.paid) : 0;
  const numericAmount = Number(amount) || 0;

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open, order?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (numericAmount <= 0) {
      setError(t("Enter a payment greater than 0"));
      return;
    }
    if (numericAmount > remaining) {
      setError(`${t("Cannot exceed remaining")} ${formatEgp(remaining)}`);
      return;
    }
    onConfirm(order.id, numericAmount);
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Confirmation of payment due to supplier")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            {/* Summary card */}
            <div className="mb-5 rounded-[12px] border border-[#CACBD4] bg-[#FAFAF7] px-4 py-4 text-[14px] sm:px-5">
              <div className="flex items-center justify-between py-1">
                <span className="text-[#28293D]">{t("Order Supplier:")}</span>
                <span className="font-semibold text-[#28293D]">
                  {order.supplierName}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#28293D]">{t("Original order value:")}</span>
                <span className="font-semibold text-[#28293D]" dir="ltr">
                  {formatEgp(order.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#28293D]">{t("Previously paid:")}</span>
                <span className="font-semibold text-[#28293D]" dir="ltr">
                  {formatEgp(order.paid)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-[#C90000]">{t("Remaining:")}</span>
                <span className="font-semibold text-[#C90000]" dir="ltr">
                  {formatEgp(remaining)}
                </span>
              </div>
            </div>

            {/* Amount input */}
            <div className="flex flex-col">
              <Label
                htmlFor="payment-amount"
                className="mb-2.5 text-[16px] font-medium text-black"
              >
                {t("Current payment amount (EGP)")}
                <span className="text-[#C90000]">*</span>
              </Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError("");
                }}
                placeholder="0"
                className={cn(
                  "h-12.5 rounded-xl border border-[#E5E5E5] bg-white px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
                  error && "border-[#C90000]",
                )}
              />
              <p className="mt-1.5 text-[12px] text-[#8B8B8B]">
                {t("This payment will be automatically recorded in the accounts/expenses ledger.")}
              </p>
              {error && (
                <p className="mt-1.5 text-[13px] text-[#C90000]">{error}</p>
              )}
            </div>
          </form>

          {/* Sticky footer: single separator, then Total + actions */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 h-px w-full bg-[#CACBD4] sm:mb-5" />

            {/* Total — stacked, right-aligned */}
            <div className="mb-4 flex flex-col items-end sm:mb-5">
              <p className="text-[12px] font-medium text-[#8B8B8B]">{t("Total")}</p>
              <p className="text-[22px] font-bold text-[#28293D] sm:text-[24px]" dir="ltr">
                {formatEgp(numericAmount)}
              </p>
            </div>

            <Separator className="mb-4 h-px w-full bg-[#CACBD4] sm:mb-5" />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Confirm exchange")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
