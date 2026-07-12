import { useEffect, useMemo, useState } from "react";
import { api } from "@/config/api";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, CustomerLookup, DeliveryZone, Order, ProductOption } from "../types";
import { CUSTOMER_DIRECTORY } from "../data";
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
  deliveryZones: DeliveryZone[];
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: Order) => void;
}

const NewCallOrderDialog = ({
  open,
  productOptions,
  deliveryZones,
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
  const [isSearching, setIsSearching] = useState(false);
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
    setIsSearching(false);
  };

  useEffect(() => {
    if (!open) resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearch = async () => {
    const normalized = phoneQuery.replace(/\s/g, "");
    if (!normalized) return;

    setIsSearching(true);
    setSearched(true);
    try {
      const response = await api.get(`/customers/by-phone/${normalized}`);
      const customer = response.data?.customer || response.data;
      if (customer) {
        const foundCustomer: CustomerLookup = {
          name: customer.name,
          phone: customer.phone,
          lastAddress: "",
          tier: customer.tier || "bronze",
        };

        const addr = customer.addresses?.find((a: any) => a.isDefault) || customer.addresses?.[0];
        if (addr) {
          const addressStr = [
            addr.buildingName ? `Building ${addr.buildingName}` : "",
            addr.street ? `Street ${addr.street}` : "",
            addr.floor ? `Floor ${addr.floor}` : "",
            addr.apartmentNo ? `Apt ${addr.apartmentNo}` : "",
            addr.area || addr.zone || ""
          ].filter(Boolean).join(", ");

          foundCustomer.lastAddress = addressStr;
          setAddress(addressStr);

          const matchedZone = deliveryZones.find(
            (z) => z.name.toLowerCase() === (addr.zone || "").toLowerCase()
          );
          if (matchedZone) {
            handleZoneChange(matchedZone.id);
          } else {
            setZoneId("");
          }
        } else {
          setAddress("");
          setZoneId("");
        }

        setExisting(foundCustomer);
        setName(customer.name || "");
        setPhone(customer.phone || "");
      } else {
        setExisting(null);
        setPhone(phoneQuery);
        setName("");
        setAddress("");
        setZoneId("");
      }
    } catch (err) {
      console.error("Customer lookup failed:", err);
      setExisting(null);
      setPhone(phoneQuery);
      setName("");
      setAddress("");
      setZoneId("");
    } finally {
      setIsSearching(false);
    }
  };

  const handleZoneChange = (id: string) => {
    setZoneId(id);
    const zone = deliveryZones.find((item) => item.id === id);
    if (zone) payment.setDeliveryFee(String(zone.deliveryFee));
  };

  const handleCreate = () => {
    const now = new Date();
    const zone = deliveryZones.find((item) => item.id === zoneId);

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

  const isStep0Valid = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "" && zoneId !== "";
  const isStep1Valid = cart.length > 0;
  const isStep2Valid = useMemo(() => {
    if (payment.deliveryFee.trim() === "" || Number(payment.deliveryFee) < 0) {
      return false;
    }
    if (payment.paymentMethod === "Mix") {
      return (
        payment.cashAmount.trim() !== "" &&
        payment.visaAmount.trim() !== "" &&
        Number(payment.cashAmount) >= 0 &&
        Number(payment.visaAmount) >= 0
      );
    }
    return true;
  }, [payment.deliveryFee, payment.paymentMethod, payment.cashAmount, payment.visaAmount]);

  const primaryButton = () => {
    if (step === 0) {
      return {
        buttonText: t("Next Add Products"),
        onClick: () => setStep(1),
        className: !isStep0Valid ? "pointer-events-none opacity-60" : "",
      };
    }
    if (step === 1) {
      return {
        buttonText: `${t("Add products to cart")} ${formatCurrency(subtotal)}`,
        onClick: () => setStep(2),
        className: !isStep1Valid ? "pointer-events-none opacity-60" : "",
      };
    }
    return {
      buttonText: t("Create Order"),
      onClick: handleCreate,
      className: !isStep2Valid ? "pointer-events-none opacity-60" : "",
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
                onStepClick={(targetStep) => {
                  if (targetStep > 0 && !isStep0Valid) return;
                  if (targetStep > 1 && !isStep1Valid) return;
                  setStep(targetStep);
                }}
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
                deliveryZones={deliveryZones}
                isSearching={isSearching}
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
            <div className="flex justify-between items-center gap-3">
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
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <DefaultButton
                    data={{
                      buttonText: t("Back"),
                      variant: "outline",
                      type: "button",
                      onClick: () => setStep((prev) => prev - 1),
                      className:
                        "border-[#CACBD4] text-[#23252A] hover:bg-[#FAFAF7] hover:text-[#23252A]",
                    }}
                  />
                )}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCallOrderDialog;
