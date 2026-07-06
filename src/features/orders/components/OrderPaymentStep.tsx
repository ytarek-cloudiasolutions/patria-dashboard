import { Banknote, CreditCard, Wallet } from "lucide-react";

import { Separator } from "@/shared/components/ui/separator";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { formatCurrency } from "../utils";
import {
  paymentDeliveryFee,
  paymentTotal,
  type OrderPaymentControls,
  type PaymentMethod,
} from "../useOrderPayment";

interface OrderPaymentStepProps {
  payment: OrderPaymentControls;
  subtotal: number;
}

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Visa/Card", "Mix"];

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  Cash: Banknote,
  "Visa/Card": CreditCard,
  Mix: Wallet,
};

const OrderPaymentStep = ({ payment, subtotal }: OrderPaymentStepProps) => {
  const { t } = useTranslation();
  const isMix = payment.paymentMethod === "Mix";
  const total = paymentTotal(payment, subtotal);

  return (
    <div className="space-y-5">
      {/* Payment method */}
      <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-5">
        <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
          {t("Payment Method")}
        </p>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {PAYMENT_METHODS.map((method) => {
            const Icon = PAYMENT_ICONS[method];
            const active = payment.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => payment.setPaymentMethod(method)}
                className={`flex h-16 flex-col items-center justify-center gap-2 rounded-[8px] border-2 bg-white text-[13px] font-medium text-[#111111] sm:h-[84px] sm:text-[16px] ${
                  active ? "border-primary bg-[#F5F0EA]" : "border-[#E5E5E5]"
                }`}
              >
                <Icon className="size-4 sm:size-6" />
                {t(method)}
              </button>
            );
          })}
        </div>

        {isMix && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              id="cash-amount"
              label={t("Cash Amount")}
              required
              type="number"
              placeholder="0.00"
              inputProps={{
                value: payment.cashAmount,
                onChange: (e) => payment.setCashAmount(e.target.value),
              }}
            />
            <InputField
              id="visa-amount"
              label={t("Visa Amount")}
              required
              type="number"
              placeholder="0.00"
              inputProps={{
                value: payment.visaAmount,
                onChange: (e) => payment.setVisaAmount(e.target.value),
              }}
            />
          </div>
        )}
      </section>

      {/* Discount / Delivery / Notes */}
      <div className="flex items-end gap-2.5">
        <InputField
          id="discount-code"
          label={t("Discount Code")}
          required
          placeholder="0.00"
          wrapperClassName="flex-1"
          inputProps={{
            value: payment.discountCode,
            onChange: (e) => payment.setDiscountCode(e.target.value),
          }}
        />
        <DefaultButton
          data={{
            buttonText: t("Apply"),
            variant: "outline",
            type: "button",
            onClick: payment.applyDiscount,
            className:
              "sm:h-12.5 border-primary text-primary hover:bg-white hover:text-primary",
          }}
        />
      </div>

      <InputField
        id="delivery-fee"
        label={t("Delivery Fee")}
        required
        type="number"
        placeholder="0.00"
        inputProps={{
          value: payment.deliveryFee,
          onChange: (e) => payment.setDeliveryFee(e.target.value),
        }}
      />

      <InputField
        id="order-notes"
        label={`${t("Order Notes")} (${t("Optional")})`}
        placeholder={t("Order Notes")}
        inputProps={{
          value: payment.notes,
          onChange: (e) => payment.setNotes(e.target.value),
        }}
      />

      {/* Summary */}
      <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between text-[15px] text-[#23252A]">
            <span>{t("Subtotal")}:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[15px] text-[#059B5A]">
            <span>{t("Discount")}:</span>
            <span>-{formatCurrency(payment.appliedDiscount)}</span>
          </div>
          <div className="flex items-center justify-between text-[15px] text-[#23252A]">
            <span>{t("Delivery Fees")}:</span>
            <span>{formatCurrency(paymentDeliveryFee(payment))}</span>
          </div>
          <Separator className="bg-[#D9D9D9]" />
          <div className="flex items-center justify-between text-[18px] font-semibold text-black">
            <span>{t("Total")}:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderPaymentStep;
