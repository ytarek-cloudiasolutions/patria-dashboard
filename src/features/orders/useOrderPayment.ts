import { useState } from "react";
import { api } from "@/config/api";
import { showErrorToast } from "@/shared/utils/toast";

export type PaymentMethod = "Cash" | "Visa/Card" | "Mix";
export type DiscountType = "fixed" | "percentage";

export interface OrderPaymentControls {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashAmount: string;
  setCashAmount: (value: string) => void;
  visaAmount: string;
  setVisaAmount: (value: string) => void;
  discountCode: string;
  setDiscountCode: (value: string) => void;
  appliedDiscount: number;
  discountType: DiscountType | null;
  discountValue: number;
  isApplyingDiscount: boolean;
  applyDiscount: (subtotal: number) => Promise<void>;
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
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(initialDeliveryFee);
  const [notes, setNotes] = useState("");

  const handleDiscountCodeChange = (value: string) => {
    setDiscountCode(value);

    if (!value.trim()) {
      setAppliedDiscount(0);
      setDiscountType(null);
      setDiscountValue(0);
    }
  };

  // This used to just set a hardcoded 24 EGP off for ANY non-empty code,
  // with no check against the real Coupon/Offer records at all — and even
  // that fake number was then dropped before the order was ever created
  // (see OrdersPage.handleCreateOrder), so the saved order's total was
  // always the full, undiscounted amount regardless. Now actually
  // validates the code against /coupons/validate (same endpoint the mobile
  // app uses) and shows the real computed discount; the backend applies it
  // for real when the order is created (createOrder now re-validates the
  // code itself rather than trusting this client-side preview).
  const applyDiscount = async (subtotal: number) => {
    const code = discountCode.trim();
    if (!code) {
      setAppliedDiscount(0);
      setDiscountType(null);
      setDiscountValue(0);
      return;
    }
    setIsApplyingDiscount(true);
    try {
      const { data } = await api.post<{
        valid: boolean;
        discountAmount: number;
        discountType?: DiscountType;
        discountValue?: number;
        coupon?: { discountType?: DiscountType; discountValue?: number };
        message?: string;
      }>(
        "/coupons/validate",
        { code, orderTotal: subtotal },
      );
      if (data?.valid) {
        setAppliedDiscount(Number(data.discountAmount) || 0);
        const type = data.discountType ?? data.coupon?.discountType ?? "fixed";
        const value = Number(data.discountValue ?? data.coupon?.discountValue);
        setDiscountType(type);
        setDiscountValue(Number.isFinite(value) ? value : Number(data.discountAmount) || 0);
      } else {
        setAppliedDiscount(0);
        setDiscountType(null);
        setDiscountValue(0);
        showErrorToast(data?.message || "Invalid discount code");
      }
    } catch (err: unknown) {
      setAppliedDiscount(0);
      setDiscountType(null);
      setDiscountValue(0);
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || "Invalid discount code");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const reset = () => {
    setPaymentMethod("Visa/Card");
    setCashAmount("");
    setVisaAmount("");
    setDiscountCode("");
    setAppliedDiscount(0);
    setDiscountType(null);
    setDiscountValue(0);
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
    appliedDiscount,
    discountType,
    discountValue,
    isApplyingDiscount,
    applyDiscount,
    deliveryFee,
    setDeliveryFee,
    notes,
    setNotes,
    reset,
  };
};

export const paymentDeliveryFee = (payment: OrderPaymentControls) =>
  Number(payment.deliveryFee) || 0;

export const paymentTax = (
  payment: OrderPaymentControls,
  subtotal: number,
  taxRate = 0,
) => Math.max(subtotal - payment.appliedDiscount, 0) * taxRate;

export const paymentTotal = (
  payment: OrderPaymentControls,
  subtotal: number,
  taxRate = 0,
) => {
  const discountedSubtotal = Math.max(subtotal - payment.appliedDiscount, 0);

  return discountedSubtotal + paymentTax(payment, subtotal, taxRate) + paymentDeliveryFee(payment);
};

export const paymentMethodLabel = (payment: OrderPaymentControls) =>
  payment.paymentMethod === "Mix"
    ? `Cash ${payment.cashAmount || "0"} + Visa ${payment.visaAmount || "0"}`
    : payment.paymentMethod;
