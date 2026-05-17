import { useMemo, useState } from "react";
import { Banknote, ChevronDown, CreditCard, Minus, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import InputField from "@/shared/components/InputField";
import type { Order, OrderLineItem, ProductOption } from "../types";
import DefaultButton from "@/shared/components/DefaultButton";

interface NewPosOrderDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: Order) => void;
}

type PaymentMethod = "Cash" | "Visa/Card" | "Mix";

const paymentMethods: PaymentMethod[] = ["Cash", "Visa/Card", "Mix"];

const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const NewPosOrderDialog = ({
  open,
  productOptions,
  onOpenChange,
  onCreateOrder,
}: NewPosOrderDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Visa/Card");
  const [cashAmount, setCashAmount] = useState("");
  const [visaAmount, setVisaAmount] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("27");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderLineItem[]>([
    { id: 1, name: "Middle Eastern Roast Beef", quantity: 2, unitPrice: 120 },
    { id: 2, name: "Green Ranch Sandwich", quantity: 1, unitPrice: 120 },
  ]);

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.quantity * item.unitPrice, 0),
    [items]
  );

  const discount = discountCode.trim() ? 24 : 0;
  const parsedDeliveryFee = Number(deliveryFee) || 0;

  const total = Math.max(subtotal - discount + parsedDeliveryFee, 0);

  const addProduct = (product: ProductOption) => {
    setItems((previous) => {
      const existing = previous.find((item) => item.name === product.name);

      if (existing) {
        return previous.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          id: Date.now(),
          name: product.name,
          quantity: 1,
          unitPrice: product.unitPrice,
        },
      ];
    });
  };

  const updateQuantity = (
    itemId: number,
    direction: "increase" | "decrease"
  ) => {
    setItems((previous) =>
      previous
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity:
                  direction === "increase"
                    ? item.quantity + 1
                    : Math.max(item.quantity - 1, 0),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCreateOrder = () => {
    const now = new Date();

    onCreateOrder({
      id: `POS-${now.getTime().toString().slice(-6)}`,
      customerName: customerName.trim() || "Walk-in Customer",
      customerPhone: phoneNumber.trim() || "+20 122 555 7890",
      customerEmail: email.trim() || undefined,
      address: address.trim() || "Patria Branch",
      date: now.toLocaleDateString("en-US"),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      subtotal,
      discount,
      deliveryFee: parsedDeliveryFee,
      total,
      status: "Pending",
      category: "Meals",
      source: "pos",
      paymentMethod:
        paymentMethod === "Mix"
          ? `Cash ${cashAmount || "0"} + Visa ${visaAmount || "0"}`
          : paymentMethod,
      paymentState: "Waiting for payment",
      items,
    });

    setCustomerName("");
    setPhoneNumber("");
    setEmail("");
    setAddress("");
    setDiscountCode("");
    setDeliveryFee("27");
    setNotes("");
    setCashAmount("");
    setVisaAmount("");
    setPaymentMethod("Visa/Card");

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[8px] bg-white p-0 ring-0 sm:max-w-140 lg:max-w-174"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-4 pt-4 sm:px-6 sm:pt-6">
            <DialogTitle className="text-[18px] font-semibold text-[#333333] sm:text-[22px]">
              New POS Order
            </DialogTitle>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
            {/* Customer Information */}
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-6">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959] sm:mb-6">
                Customer Information
              </p>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-[18px]">
                <InputField
                  id="customer-name"
                  label="Customer Name"
                  required
                  placeholder="Customer Name"
                  inputProps={{
                    value: customerName,
                    onChange: (e) => setCustomerName(e.target.value),
                  }}
                />

                <InputField
                  id="phone-number"
                  label="Phone Number"
                  required
                  placeholder="01X XXXX XXXX"
                  inputProps={{
                    value: phoneNumber,
                    onChange: (e) => setPhoneNumber(e.target.value),
                  }}
                />

                <InputField
                  id="email"
                  label="Email Address"
                  required
                  type="email"
                  placeholder="Email Address"
                  inputProps={{
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                  }}
                />

                <InputField
                  id="address"
                  label="Address"
                  required
                  placeholder="Address"
                  inputProps={{
                    value: address,
                    onChange: (e) => setAddress(e.target.value),
                  }}
                />
              </div>
            </section>

            {/* Products */}
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-6">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959] sm:mb-6">
                Products
              </p>

              <Label className="mb-2.5 text-[16px] font-medium text-black">
                Product <span className="ml-1 text-[#C90000]">*</span>
              </Label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mb-4 h-12.5 w-full justify-between rounded-xl border-[#E5E5E5] bg-white px-4.5 text-[14px] font-normal text-[#8B8B8B] hover:bg-white focus-visible:ring-0"
                  >
                    Add Product
                    <ChevronDown className="size-5 text-[#000000]" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="z-70 w-[var(--radix-dropdown-menu-trigger-width)] rounded-[12px] p-2"
                >
                  {productOptions.map((product) => (
                    <DropdownMenuItem
                      key={product.id}
                      className="cursor-pointer rounded-[8px] px-3 py-2 text-[13px]"
                      onSelect={() => addProduct(product)}
                    >
                      {product.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid min-h-[50px] grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3"
                  >
                    <span className="truncate text-[14px] text-black">
                      {item.name}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, "decrease")}
                        className="flex size-[26px] items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                      >
                        <Minus className="size-3.5" />
                      </button>

                      <span className="w-5 text-center text-[13px] font-bold text-[#28293D]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, "increase")}
                        className="flex size-[26px] items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    {/* Updated Price */}
                    <span className="whitespace-nowrap text-right text-[13px] font-semibold text-[#28293D]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-6">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959] sm:mb-6">
                Payment Method
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex h-16 flex-col items-center justify-center gap-2 rounded-[5px] border-2 bg-white text-[13px] font-medium text-[#111111] sm:h-[88px] sm:text-[18px] ${
                      paymentMethod === method
                        ? "border-primary bg-[#F5F0EA]"
                        : "border-[#E5E5E5]"
                    }`}
                  >
                    {method === "Visa/Card" ? (
                      <CreditCard className="size-4 sm:size-6" />
                    ) : (
                      <Banknote className="size-4 sm:size-6" />
                    )}

                    {method}
                  </button>
                ))}
              </div>

              {/* Conditional Payment Inputs */}
              <div
                className={`mt-4 grid gap-4 ${
                  paymentMethod === "Mix" ? "sm:grid-cols-2" : "grid-cols-1"
                } sm:gap-6`}
              >
                {(paymentMethod === "Cash" || paymentMethod === "Mix") && (
                  <InputField
                    id="cash-amount"
                    label="Cash Amount"
                    required
                    placeholder="0.00"
                    inputProps={{
                      value: cashAmount,
                      onChange: (e) => setCashAmount(e.target.value),
                    }}
                  />
                )}

                {(paymentMethod === "Visa/Card" || paymentMethod === "Mix") && (
                  <InputField
                    id="visa-amount"
                    label="Visa Amount"
                    required
                    placeholder="0.00"
                    inputProps={{
                      value: visaAmount,
                      onChange: (e) => setVisaAmount(e.target.value),
                    }}
                  />
                )}
              </div>
            </section>

            {/* Discount / Delivery / Notes */}
            <div className="space-y-4">
              <div className="flex items-end gap-2.5">
                <InputField
                  id="discount-code"
                  label="Discount Code"
                  required
                  placeholder="0.00"
                  wrapperClassName="flex-1"
                  inputProps={{
                    value: discountCode,
                    onChange: (e) => setDiscountCode(e.target.value),
                  }}
                />
                <DefaultButton
                  data={{
                    buttonText: "Apply",
                    variant: "outline",
                    type: "button",
                    className:
                      "sm:h-[50px] border-primary text-primary hover:bg-white hover:text-primary",
                  }}
                />
              </div>
              <InputField
                id="delivery-fee"
                label="Delivery Fee"
                required
                placeholder="0.00"
                inputProps={{
                  value: deliveryFee,
                  onChange: (e) => setDeliveryFee(e.target.value),
                }}
              />

              <InputField
                id="order-notes"
                label="Order Notes (Optional)"
                placeholder="Order Notes"
                inputProps={{
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                }}
              />
            </div>

            {/* Order Summary */}
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4 sm:p-6">
              <div className="flex flex-col gap-[18px]">
                <SummaryRow
                  label="Subtotal:"
                  value={formatCurrency(subtotal)}
                />

                <SummaryRow
                  label="Discount:"
                  value={`-EGP ${discount.toFixed(2)}`}
                  labelClassName="text-[#059B5A]"
                  valueClassName="text-[#059B5A]"
                />

                <SummaryRow
                  label="Delivery Fees:"
                  value={formatCurrency(parsedDeliveryFee)}
                />

                <Separator className="bg-[#D9D9D9]" />

                <SummaryRow
                  label="Total:"
                  value={formatCurrency(total)}
                  className="text-[18px] font-semibold text-black"
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-white px-4 py-4 sm:px-6 sm:py-5">
            <Separator className="mb-4 bg-[#D9D9D9] sm:mb-5" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  variant: "outline",
                  onClick: () => onOpenChange(false),
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Create Order",
                  onClick: handleCreateOrder,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

const SummaryRow = ({
  label,
  value,
  className,
  valueClassName,
  labelClassName,
}: SummaryRowProps) => (
  <div
    className={`flex items-center justify-between text-[16px] text-[#23252A] ${
      className ?? ""
    }`}
  >
    <span className={labelClassName}>{label}</span>

    <span className={valueClassName}>{value}</span>
  </div>
);

export default NewPosOrderDialog;
