import { useState } from "react";
import { api } from "@/config/api";
import { showErrorToast } from "@/shared/utils/toast";

export type PaymentMethod = "Cash" | "Visa/Card" | "Mix";
export type DiscountType = "fixed" | "percentage";

export interface OrderPricingPreview {
  subtotal: number;
  tax: number;
  discountAmount: number;
  discountType: DiscountType | null;
  discountValue: number;
  deliveryFee: number;
  total: number;
}

export interface OrderPaymentControls {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashAmount: string;
  setCashAmount: (value: string) => void;
  visaAmount: string;
  setVisaAmount: (value: string) => void;
  discountCode: string;
  setDiscountCode: (value: string) => void;
  /** Real subtotal/tax/discount/total from `POST /orders/preview` — the
   * exact same math `createOrder` bills with, so this screen can never show
   * a different number than what the order actually gets charged. `null`
   * until the first preview resolves (e.g. before the payment step is
   * reached, or the cart is empty). */
  preview: OrderPricingPreview | null;
  isPreviewing: boolean;
  /** Re-fetches `preview` for the current cart/deliveryFee/discountCode. */
  refreshPreview: (items: { price: number; quantity: number }[]) => Promise<void>;
  deliveryFee: string;
  setDeliveryFee: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  reset: () => void;
}

/** Shared payment-section state used by the POS and Call order wizards. */
export const useOrderPayment = (
  initialDeliveryFee = "27",
): OrderPaymentControls => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Visa/Card");
  const [cashAmount, setCashAmount] = useState("");
  const [visaAmount, setVisaAmount] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [preview, setPreview] = useState<OrderPricingPreview | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(initialDeliveryFee);
  const [notes, setNotes] = useState("");

  // Subtotal/tax/discount/total used to be computed here client-side —
  // first discounting off subtotal alone, then (after a later change) taxing
  // the discounted subtotal instead — two different formulas, neither
  // matching what createOrder actually bills. POST /orders/preview runs the
  // exact same computeOrderPricing() the real order creation does, so this
  // screen can't drift from reality again.
  const refreshPreview = async (items: { price: number; quantity: number }[]) => {
    if (!items.length) {
      setPreview(null);
      return;
    }
    const code = discountCode.trim();
    setIsPreviewing(true);
    try {
      const { data } = await api.post<OrderPricingPreview>("/orders/preview", {
        items,
        deliveryFee: Number(deliveryFee) || 0,
        couponCode: code || undefined,
      });
      setPreview(data);
    } catch (err: unknown) {
      setPreview(null);
      if (code) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        showErrorToast(message || "Invalid discount code");
      }
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleDiscountCodeChange = (value: string) => {
    setDiscountCode(value);
    if (!value.trim() && preview) {
      setPreview({ ...preview, discountAmount: 0, discountType: null, discountValue: 0 });
    }
  };

  const reset = () => {
    setPaymentMethod("Visa/Card");
    setCashAmount("");
    setVisaAmount("");
    setDiscountCode("");
    setPreview(null);
    setDeliveryFee(initialDeliveryFee);
    setNotes("");
  };

  return {
    paymentMethod,
    setPaymentMethod,
    cashAmount,
    setCashAmount,
    visaAmount,
    setVisaAmount,
    discountCode,
    setDiscountCode: handleDiscountCodeChange,
    preview,
    isPreviewing,
    refreshPreview,
    deliveryFee,
    setDeliveryFee,
    notes,
    setNotes,
    reset,
  };
};

export const paymentDeliveryFee = (payment: OrderPaymentControls) =>
  Number(payment.deliveryFee) || 0;

export const paymentMethodLabel = (payment: OrderPaymentControls) =>
  payment.paymentMethod === "Mix"
    ? `Cash ${payment.cashAmount || "0"} + Visa ${payment.visaAmount || "0"}`
    : payment.paymentMethod;
