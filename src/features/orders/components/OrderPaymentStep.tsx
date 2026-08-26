import { Banknote, CreditCard, Wallet } from "lucide-react";

import { Separator } from "@/shared/components/ui/separator";
import { useTranslation } from "@/shared/i18n/useTranslation";
import {
  paymentDeliveryFee,
  paymentTotal,
  type OrderPaymentControls,
  type PaymentMethod,
} from "../useOrderPayment";

interface OrderPaymentStepProps {
  payment: OrderPaymentControls;
  subtotal: number;
  errors?: Record<string, string>;
}

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Visa/Card", "Mix"];

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  Cash: Banknote,
  "Visa/Card": CreditCard,
  Mix: Wallet,
};

const OrderPaymentStep = ({ payment, subtotal, errors = {} }: OrderPaymentStepProps) => {
  const { t } = useTranslation();
  const isMix = payment.paymentMethod === "Mix";
  const total = paymentTotal(payment, subtotal);

  return (
    <div className="space-y-6">
      {/* Payment method */}
      <section className="flex flex-col gap-6 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-6 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.20px] text-[#595959]">
          {t("PAYMENT METHOD")}
        </p>
        <div className="grid grid-cols-3 gap-6">
          {PAYMENT_METHODS.map((method) => {
            const Icon = PAYMENT_ICONS[method];
            const active = payment.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => payment.setPaymentMethod(method)}
                className={`flex h-[110px] flex-col items-center justify-center gap-2 rounded-[5px] border-2 transition-colors cursor-pointer ${
                  active
                    ? "border-primary bg-[#F5F0EA] text-black"
                    : "border-[#E5E5E5] bg-[#FAFAF7] text-black"
                }`}
              >
                <Icon className="size-6 text-black" />
                <span className="text-[18px] font-medium tracking-[0.36px] text-black leading-[19.26px]">
                  {t(method)}
                </span>
              </button>
            );
          })}
        </div>

        {isMix && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="cash-amount" className="text-[16px] font-medium text-black">
                {t("Cash Amount")} <span className="text-[#C90000]">*</span>
              </label>
              <input
                id="cash-amount"
                type="number"
                placeholder="0.00"
                value={payment.cashAmount}
                onChange={(e) => payment.setCashAmount(e.target.value)}
                className={`h-[50px] w-full rounded-[12px] border bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:outline-none focus:ring-1 ${
                  errors.cashAmount
                    ? "border-[#C90000] focus:border-[#C90000] focus:ring-[#C90000]"
                    : "border-[#E5E5E5] focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.cashAmount && (
                <p className="text-[13px] font-medium text-[#C90000]">{errors.cashAmount}</p>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <label htmlFor="visa-amount" className="text-[16px] font-medium text-black">
                {t("Visa Amount")} <span className="text-[#C90000]">*</span>
              </label>
              <input
                id="visa-amount"
                type="number"
                placeholder="0.00"
                value={payment.visaAmount}
                onChange={(e) => payment.setVisaAmount(e.target.value)}
                className={`h-[50px] w-full rounded-[12px] border bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:outline-none focus:ring-1 ${
                  errors.visaAmount
                    ? "border-[#C90000] focus:border-[#C90000] focus:ring-[#C90000]"
                    : "border-[#E5E5E5] focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.visaAmount && (
                <p className="text-[13px] font-medium text-[#C90000]">{errors.visaAmount}</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Form Fields: Discount Code, Delivery Fee, Order Notes */}
      <div className="flex flex-col gap-4">
        {/* Discount Code */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="discount-code" className="text-[16px] font-medium text-black">
            {t("Discount Code")} <span className="text-[#C90000]">*</span>
          </label>
          <div className="flex items-center gap-2.5">
            <input
              id="discount-code"
              type="text"
              placeholder="0.00"
              value={payment.discountCode}
              onChange={(e) => payment.setDiscountCode(e.target.value)}
              className="h-[50px] flex-1 rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={payment.applyDiscount}
              className="h-[50px] rounded-[5px] border border-primary px-6 text-[16px] font-semibold text-primary cursor-pointer"
            >
              {t("Apply")}
            </button>
          </div>
        </div>

        {/* Delivery Fee */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="delivery-fee" className="text-[16px] font-medium text-black">
            {t("Delivery Fee")} <span className="text-[#C90000]">*</span>
          </label>
          <input
            id="delivery-fee"
            type="number"
            placeholder="0.00"
            value={payment.deliveryFee}
            onChange={(e) => payment.setDeliveryFee(e.target.value)}
            className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Order Notes */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="order-notes" className="text-[16px] font-medium text-black">
            {t("Order Notes")}{" "}
            <span className="text-[13px] font-medium text-[#595959]">
              ({t("Optional")})
            </span>
          </label>
          <input
            id="order-notes"
            type="text"
            placeholder={t("Order Notes")}
            value={payment.notes}
            onChange={(e) => payment.setNotes(e.target.value)}
            className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Summary */}
      <section className="flex flex-col gap-4 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-[16px]">
            <span className="font-medium text-[#23252A]">{t("Subtotal")}:</span>
            <span className="text-[#333333]">
              <span className="font-medium">EGP </span>
              <span className="font-semibold">{subtotal.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[16px] text-[#059B5A]">
            <span className="font-medium">{t("Discount")}:</span>
            <span>
              <span className="font-medium">EGP </span>
              <span className="font-semibold">{payment.appliedDiscount.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[16px]">
            <span className="font-medium text-[#23252A]">{t("Delivery Fees")}:</span>
            <span className="text-[#333333]">
              <span className="font-medium">EGP </span>
              <span className="font-semibold">{paymentDeliveryFee(payment).toFixed(2)}</span>
            </span>
          </div>
        </div>
        <Separator className="bg-[#CACBD4]" />
        <div className="flex items-center justify-between text-[18px] text-black">
          <span className="font-semibold">{t("Total")}:</span>
          <span>
            <span className="font-medium">EGP </span>
            <span className="font-bold">{total.toFixed(2)}</span>
          </span>
        </div>
      </section>
    </div>
  );
};

export default OrderPaymentStep;
