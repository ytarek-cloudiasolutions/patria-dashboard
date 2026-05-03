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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import type { Order, OrderLineItem, ProductOption } from "../types";

interface NewPosOrderDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: Order) => void;
}

type PaymentMethod = "Cash" | "Visa/Card" | "Mix";

const paymentMethods: PaymentMethod[] = ["Cash", "Visa/Card", "Mix"];

const fieldClassName =
  "h-10 rounded-[8px] border-[#E5E5E5] bg-white px-3 text-[13px] text-[#23252A] placeholder:text-[#B5B5B5] focus-visible:ring-0";

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
    {
      id: 1,
      name: "Middle Eastern Roast Beef",
      quantity: 2,
      unitPrice: 120,
    },
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
            ? { ...item, quantity: item.quantity + 1 }
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-3rem)] max-w-140 overflow-hidden rounded-[8px] bg-white p-0 ring-0 sm:max-w-174"
      >
        <div className="flex max-h-[calc(100vh-3rem)] flex-col">
          <div className="px-6 pt-6">
            <DialogTitle className="text-[22px] font-semibold text-[#333333]">
              New POS Order
            </DialogTitle>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
                Customer Information
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Customer Name"
                  required
                  value={customerName}
                  placeholder="Customer Name"
                  onChange={setCustomerName}
                />
                <Field
                  label="Phone Number"
                  required
                  value={phoneNumber}
                  placeholder="01X XXXX XXXX"
                  onChange={setPhoneNumber}
                />
                <Field
                  label="Email Address"
                  required
                  value={email}
                  placeholder="Email Address"
                  onChange={setEmail}
                />
                <Field
                  label="Address"
                  required
                  value={address}
                  placeholder="Address"
                  onChange={setAddress}
                />
              </div>
            </section>

            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
                Products
              </p>
              <Label className="mb-2 block text-[13px] font-medium text-[#000000]">
                Product <span className="text-[#C90000]">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mb-4 h-10 w-full justify-between rounded-[8px] border-[#E5E5E5] bg-white px-3 text-[13px] font-normal text-[#8B8B8B] hover:bg-white"
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
                      className="rounded-[8px] px-3 py-2 text-[13px]"
                      onSelect={() => addProduct(product)}
                    >
                      {product.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid min-h-10 grid-cols-[1fr_auto_auto] items-center gap-3 rounded-[8px] border border-[#E5E5E5] bg-white px-3"
                  >
                    <span className="truncate text-[13px] font-medium text-[#333333]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, "decrease")}
                        className="flex size-5 items-center justify-center rounded-[4px] border border-[#E5E5E5] bg-[#FAFAF7]"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-4 text-center text-[12px] font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, "increase")}
                        className="flex size-5 items-center justify-center rounded-[4px] border border-[#E5E5E5] bg-[#FAFAF7]"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="text-right text-[12px] font-semibold text-[#28293D]">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
                Payment Method
              </p>
              <div className="grid grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex h-22 flex-col items-center justify-center gap-2 rounded-[4px] border bg-white text-[14px] font-medium text-[#111111] ${
                      paymentMethod === method
                        ? "border-primary bg-[#F5F0EA]"
                        : "border-[#E5E5E5]"
                    }`}
                  >
                    {method === "Visa/Card" ? (
                      <CreditCard className="size-5" />
                    ) : (
                      <Banknote className="size-5" />
                    )}
                    {method}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Cash Amount"
                  required
                  value={cashAmount}
                  placeholder="0.00"
                  onChange={setCashAmount}
                />
                <Field
                  label="Visa Amount"
                  required
                  value={visaAmount}
                  placeholder="0.00"
                  onChange={setVisaAmount}
                />
              </div>
            </section>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-[13px] font-medium text-[#000000]">
                  Discount Code <span className="text-[#C90000]">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={discountCode}
                    onChange={(event) => setDiscountCode(event.target.value)}
                    placeholder="0.00"
                    className={fieldClassName}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-[5px] border-primary px-5 text-[13px] font-semibold text-primary hover:bg-white hover:text-primary"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Field
                label="Delivery Fee"
                required
                value={deliveryFee}
                placeholder="0.00"
                onChange={setDeliveryFee}
              />

              <Field
                label="Order Notes"
                value={notes}
                placeholder="Order Notes"
                onChange={setNotes}
                optional
              />
            </div>

            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
              <div className="space-y-4 text-[14px]">
                <SummaryRow
                  label="Subtotal:"
                  value={formatCurrency(subtotal)}
                />
                <SummaryRow
                  label="Discount:"
                  value={`-EGP ${discount.toFixed(2)}`}
                  valueClassName="text-[#00A86B]"
                />
                <SummaryRow
                  label="Delivery Fees:"
                  value={formatCurrency(parsedDeliveryFee)}
                />
                <Separator className="bg-[#D9D9D9]" />
                <SummaryRow
                  label="Total:"
                  value={formatCurrency(total)}
                  className="font-semibold text-[#111111]"
                />
              </div>
            </section>
          </div>

          <div className="border-t border-[#D9D9D9] bg-white px-6 py-5">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 min-w-24 rounded-[5px] border-primary text-[14px] font-semibold text-primary hover:bg-white hover:text-primary"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateOrder}
                className="h-11 min-w-32 rounded-[5px] bg-primary text-[14px] font-semibold text-white hover:bg-primary"
              >
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
}

const Field = ({
  label,
  value,
  placeholder,
  onChange,
  required,
  optional,
}: FieldProps) => (
  <div>
    <Label className="mb-2 block text-[13px] font-medium text-[#000000]">
      {label}
      {required && <span className="text-[#C90000]"> *</span>}
      {optional && (
        <span className="text-[11px] text-[#8B8B8B]"> (Optional)</span>
      )}
    </Label>
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={fieldClassName}
    />
  </div>
);

interface SummaryRowProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

const SummaryRow = ({
  label,
  value,
  className,
  valueClassName,
}: SummaryRowProps) => (
  <div className={`flex items-center justify-between ${className ?? ""}`}>
    <span>{label}</span>
    <span className={valueClassName}>{value}</span>
  </div>
);

export default NewPosOrderDialog;
