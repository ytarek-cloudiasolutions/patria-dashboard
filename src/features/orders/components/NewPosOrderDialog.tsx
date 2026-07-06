import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, Order, ProductOption } from "../types";
import { cartSubtotal, cartToOrderItems, formatCurrency } from "../utils";
import {
  paymentDeliveryFee,
  paymentMethodLabel,
  paymentTotal,
  useOrderPayment,
} from "../useOrderPayment";
import OrderWizardStepper from "./OrderWizardStepper";
import OrderProductsStep from "./OrderProductsStep";
import OrderPaymentStep from "./OrderPaymentStep";

interface NewPosOrderDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: Order) => void;
}

const NewPosOrderDialog = ({
  open,
  productOptions,
  onOpenChange,
  onCreateOrder,
}: NewPosOrderDialogProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const payment = useOrderPayment("27");

  const subtotal = cartSubtotal(cart);
  const total = paymentTotal(payment, subtotal);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setCart([]);
      payment.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCreate = () => {
    const now = new Date();

    onCreateOrder({
      id: `POS-${now.getTime().toString().slice(-6)}`,
      customerName: "Walk-in Customer",
      customerPhone: "+20 122 555 7890",
      address: "Patria Branch",
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
      source: "pos",
      paymentMethod: paymentMethodLabel(payment),
      paymentState: "Waiting for payment",
      items: cartToOrderItems(cart),
    });

    onOpenChange(false);
  };

  const primary =
    step === 0
      ? {
          buttonText: `${t("Add products to cart")} ${formatCurrency(subtotal)}`,
          onClick: () => setStep(1),
          className: cart.length === 0 ? "pointer-events-none opacity-60" : "",
        }
      : {
          buttonText: t("Create Order"),
          onClick: handleCreate,
          className: cart.length === 0 ? "pointer-events-none opacity-60" : "",
        };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header + stepper */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-6">
            <DialogTitle className="text-[18px] font-semibold text-[#333333] sm:text-[22px]">
              {t("New POS Order")}
            </DialogTitle>
            <div className="mt-5">
              <OrderWizardStepper
                steps={[t("Add Products"), t("Payment Method")]}
                current={step}
                onStepClick={setStep}
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {step === 0 ? (
              <OrderProductsStep
                productOptions={productOptions}
                cart={cart}
                onCartChange={setCart}
              />
            ) : (
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

export default NewPosOrderDialog;
