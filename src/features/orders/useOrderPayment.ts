import { useState } from "react";

export type PaymentMethod = "Cash" | "Visa/Card" | "Mix";

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
  applyDiscount: () => void;
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
  const [deliveryFee, setDeliveryFee] = useState(initialDeliveryFee);
  const [notes, setNotes] = useState("");

  const applyDiscount = () =>
    setAppliedDiscount(discountCode.trim() ? 24 : 0);

  const reset = () => {
    setPaymentMethod("Visa/Card");
    setCashAmount("");
    setVisaAmount("");
    setDiscountCode("");
    setAppliedDiscount(0);
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
    setDiscountCode,
    appliedDiscount,
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

export const paymentTotal = (
  payment: OrderPaymentControls,
  subtotal: number,
) =>
  Math.max(subtotal - payment.appliedDiscount + paymentDeliveryFee(payment), 0);

export const paymentMethodLabel = (payment: OrderPaymentControls) =>
  payment.paymentMethod === "Mix"
    ? `Cash ${payment.cashAmount || "0"} + Visa ${payment.visaAmount || "0"}`
    : payment.paymentMethod;
