import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { PurchaseOrder } from "../types";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  po: PurchaseOrder;
  onConfirm: (amount: number) => void;
}

const PaymentModal = ({ open, onClose, po, onConfirm }: PaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(
    po.totalAmount - po.paid
  );
  const remaining = po.totalAmount - po.paid;

  const handleConfirm = () => {
    if (paymentAmount > 0 && paymentAmount <= remaining) {
      onConfirm(paymentAmount);
      setPaymentAmount(0);
    }
  };

  const handleClose = () => {
    setPaymentAmount(remaining);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-174 rounded-[16px] p-8">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Confirmation of payment due to supplier
          </DialogTitle>
        </DialogHeader>

        {/* Order Details */}
        <div className="bg-[#F8F8F8] rounded-[12px] p-5 space-y-4">
          <div className="flex justify-between">
            <span className="text-[#6B6B6B] text-[14px]">Order Supplier:</span>
            <span className="font-medium text-[#28293D]">{po.supplier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B] text-[14px]">
              Original order value:
            </span>
            <span className="font-medium text-[#28293D]">
              EGP {po.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B] text-[14px]">Previously paid:</span>
            <span className="font-medium text-[#28293D]">
              EGP {po.paid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-[#C90000] font-medium">Remaining:</span>
            <span className="text-[#C90000] font-semibold">
              EGP {remaining.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Input */}
        <div className="space-y-2 mt-6">
          <Label className="text-[16px] font-medium text-[#000000]">
            Current payment amount (EGP){" "}
            <span className="text-[#C90000]">*</span>
          </Label>
          <Input
            type="number"
            value={paymentAmount || ""}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            placeholder="0"
            className="h-12 text-[16px] rounded-[12px]"
            min={0}
            max={remaining}
          />
          <p className="text-[13px] text-[#6B6B6B]">
            This payment will be automatically recorded in the accounts/expenses
            ledger.
          </p>
        </div>

        {/* Total Summary */}
        <div className="mt-8 flex justify-between items-end border-t pt-6">
          <div>
            <p className="text-[13px] text-[#6B6B6B]">Total</p>
            <p className="text-[22px] font-bold text-[#28293D]">
              EGP {paymentAmount || 0}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className:
                "border-primary text-primary hover:bg-white hover:text-primary h-11 px-6",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Confirm exchange",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08] h-11 px-6",
              onClick: handleConfirm,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
