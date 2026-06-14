import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, CustomerLookup, Order, ProductOption } from "../types";
import { CUSTOMER_DIRECTORY, DELIVERY_ZONES } from "../data";
import { cartSubtotal, cartToOrderItems, formatCurrency } from "../utils";
import {
  paymentDeliveryFee,
  paymentMethodLabel,
  paymentTotal,
  useOrderPayment,
} from "../useOrderPayment";
import OrderWizardStepper from "./OrderWizardStepper";
import CallCustomerStep from "./CallCustomerStep";
import OrderProductsStep from "./OrderProductsStep";
import OrderPaymentStep from "./OrderPaymentStep";

interface NewCallOrderDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: Order) => void;
}

const NewCallOrderDialog = ({
  open,
  productOptions,
  onOpenChange,
  onCreateOrder,
}: NewCallOrderDialogProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [phoneQuery, setPhoneQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [existing, setExisting] = useState<CustomerLookup | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [isZoneMenuOpen, setIsZoneMenuOpen] = useState(false);

  const [cart, setCart] = useState<CartLineItem[]>([]);
  const payment = useOrderPayment("40");

  const subtotal = cartSubtotal(cart);
  const total = paymentTotal(payment, subtotal);

  const resetAll = () => {
    setStep(0);
    setPhoneQuery("");
    setSearched(false);
    setExisting(null);
    setName("");
    setPhone("");
    setAddress("");
    setZoneId("");
    setCart([]);
    payment.reset();
  };

  useEffect(() => {
    if (!open) resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearch = () => {
    const normalized = phoneQuery.replace(/\s/g, "");
    const found = CUSTOMER_DIRECTORY[normalized] ?? null;
    setSearched(true);
    setExisting(found);
    if (found) {
      setName(found.name);
      setPhone(found.phone);
      setAddress(found.lastAddress);
    } else {
      setPhone(phoneQuery);
    }
  };

  const handleZoneChange = (id: string) => {
    setZoneId(id);
    const zone = DELIVERY_ZONES.find((item) => item.id === id);
    if (zone) payment.setDeliveryFee(String(zone.deliveryFee));
  };

  const handleCreate = () => {
    const now = new Date();
    const zone = DELIVERY_ZONES.find((item) => item.id === zoneId);

    onCreateOrder({
      id: `CALL-${now.getTime().toString().slice(-6)}`,
      customerName: name.trim() || "Call Customer",
      customerPhone: phone.trim() || phoneQuery.trim() || "—",
      address: address.trim() || "—",
      zone: zone?.name,
      date: now.toLocaleDateString("en-US"),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      subtotal,
      discount: payment.appliedDiscount,
      deliveryFee: paymentDeliveryFee(payment),
      total,
      status: "Pending",
      category: "Meals",
      source: "call",
      paymentMethod: paymentMethodLabel(payment),
      paymentState: "Waiting for payment",
      items: cartToOrderItems(cart),
    });

    onOpenChange(false);
  };

  const primaryButton = () => {
    if (step === 0) {
      return {
        buttonText: t("Next Add Products"),
        onClick: () => setStep(1),
      };
    }
    if (step === 1) {
      return {
        buttonText: `${t("Add products to cart")} ${formatCurrency(subtotal)}`,
        onClick: () => setStep(2),
        className: cart.length === 0 ? "pointer-events-none opacity-60" : "",
      };
    }
    return {
      buttonText: t("Create Order"),
      onClick: handleCreate,
      className: cart.length === 0 ? "pointer-events-none opacity-60" : "",
    };
  };

  const primary = primaryButton();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-150"
      >
        {isZoneMenuOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header + stepper */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-6">
            <DialogTitle className="text-[18px] font-semibold text-[#333333] sm:text-[22px]">
              {t("New Call Order")}
            </DialogTitle>
            <div className="mt-5">
              <OrderWizardStepper
                steps={[
                  t("Customer Information"),
                  t("Add Products"),
                  t("Payment Method"),
                ]}
                current={step}
                onStepClick={setStep}
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {step === 0 && (
              <CallCustomerStep
                phoneQuery={phoneQuery}
                onPhoneQueryChange={setPhoneQuery}
                onSearch={handleSearch}
                searched={searched}
                existing={existing}
                name={name}
                onNameChange={setName}
                phone={phone}
                onPhoneChange={setPhone}
                address={address}
                onAddressChange={setAddress}
                zoneId={zoneId}
                onZoneChange={handleZoneChange}
                onZoneMenuOpenChange={setIsZoneMenuOpen}
              />
            )}
            {step === 1 && (
              <OrderProductsStep
                productOptions={productOptions}
                cart={cart}
                onCartChange={setCart}
              />
            )}
            {step === 2 && (
              <OrderPaymentStep payment={payment} subtotal={subtotal} />
            )}
          </div>

          {/* Footer */}
          <div className="bg-white px-5 py-4 sm:px-7 sm:py-5">
            <Separator className="mb-4 bg-[#D9D9D9]" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: primary.buttonText,
                  type: "button",
                  onClick: primary.onClick,
                  className: primary.className,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCallOrderDialog;
