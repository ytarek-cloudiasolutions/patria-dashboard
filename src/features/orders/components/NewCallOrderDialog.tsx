import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  onSearchProducts?: (search: string) => void;
}

const NewCallOrderDialog = ({
  open,
  productOptions,
  deliveryZones,
  onOpenChange,
  onCreateOrder,
  onSearchProducts,
}: NewCallOrderDialogProps) => {
  const { t, dir } = useTranslation();
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

  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});
  const [cartError, setCartError] = useState<string>("");
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const handleStep0Next = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t("Customer Name is required");
    if (!phone.trim()) errs.phone = t("Phone Number is required");
    if (!address.trim()) errs.address = t("Detailed address is required");
    if (!zoneId.trim()) errs.zone = t("Zone is required");

    setCustomerErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep(1);
  };

  const handleStep1Next = () => {
    if (cart.length === 0) {
      setCartError(t("Please add at least one product to cart"));
      return;
    }
    setCartError("");
    setStep(2);
  };

  const handleStep2Submit = () => {
    const errs: Record<string, string> = {};
    if (payment.paymentMethod === "Mix") {
      if (!payment.cashAmount.trim()) errs.cashAmount = t("Cash Amount is required");
      if (!payment.visaAmount.trim()) errs.visaAmount = t("Visa Amount is required");
    }
    setPaymentErrors(errs);
    if (Object.keys(errs).length > 0) return;
    handleCreate();
  };

  const primaryButton = () => {
    if (step === 0) {
      return {
        buttonText: t("Next Add Products"),
        onClick: handleStep0Next,
        disabled: false,
        className: "bg-primary text-white cursor-pointer h-[56px] px-[30px] rounded-[5px]",
      };
    }
    if (step === 1) {
      return {
        buttonText: `${t("Add products to cart")} ${formatCurrency(subtotal)}`,
        onClick: handleStep1Next,
        disabled: false,
        className: "bg-primary text-white cursor-pointer h-[56px] px-[30px] rounded-[5px]",
      };
    }
    return {
      buttonText: t("Create Order"),
      onClick: handleStep2Submit,
      disabled: false,
      className: "bg-primary text-white cursor-pointer h-[56px] px-[30px] rounded-[5px]",
    };
  };

  const primary = primaryButton();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-0 ring-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[991px]"
      >
        {isZoneMenuOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header + stepper */}
          <div className="px-6 pt-8">
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
              {t("New Call Order")}
            </DialogTitle>
            <div className="mt-6">
              <OrderWizardStepper
                steps={[
                  t("Customer Information"),
                  t("Add Products"),
                  t("Payment Method"),
                ]}
                current={step}
                onStepClick={(targetStep) => {
                  if (targetStep > 0) {
                    const errs: Record<string, string> = {};
                    if (!name.trim()) errs.name = t("Customer Name is required");
                    if (!phone.trim()) errs.phone = t("Phone Number is required");
                    if (!address.trim()) errs.address = t("Detailed address is required");
                    if (!zoneId.trim()) errs.zone = t("Zone is required");
                    if (Object.keys(errs).length > 0) {
                      setCustomerErrors(errs);
                      setStep(0);
                      return;
                    }
                  }
                  if (targetStep > 1 && cart.length === 0) {
                    setCartError(t("Please add at least one product to cart"));
                    setStep(1);
                    return;
                  }
                  setStep(targetStep);
                }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {step === 0 && (
              <CallCustomerStep
                phoneQuery={phoneQuery}
                onPhoneQueryChange={setPhoneQuery}
                onSearch={handleSearch}
                searched={searched}
                existing={existing}
                name={name}
                onNameChange={(val) => {
                  setName(val);
                  if (val.trim()) setCustomerErrors((prev) => ({ ...prev, name: "" }));
                }}
                phone={phone}
                onPhoneChange={(val) => {
                  setPhone(val);
                  if (val.trim()) setCustomerErrors((prev) => ({ ...prev, phone: "" }));
                }}
                address={address}
                onAddressChange={(val) => {
                  setAddress(val);
                  if (val.trim()) setCustomerErrors((prev) => ({ ...prev, address: "" }));
                }}
                zoneId={zoneId}
                onZoneChange={(val) => {
                  handleZoneChange(val);
                  if (val.trim()) setCustomerErrors((prev) => ({ ...prev, zone: "" }));
                }}
                onZoneMenuOpenChange={setIsZoneMenuOpen}
                deliveryZones={deliveryZones}
                isSearching={isSearching}
                errors={customerErrors}
              />
            )}
            {step === 1 && (
              <OrderProductsStep
                productOptions={productOptions}
                cart={cart}
                onCartChange={(newCart) => {
                  setCart(newCart);
                  if (newCart.length > 0) setCartError("");
                }}
                onSearchProducts={onSearchProducts}
                cartError={cartError}
              />
            )}
            {step === 2 && (
              <OrderPaymentStep
                payment={payment}
                subtotal={subtotal}
                errors={paymentErrors}
              />
            )}
          </div>

          {/* Footer */}
          <div className="bg-white px-6 pb-6 pt-4">
            <Separator className="mb-6 bg-[#CACBD4]" />
            <div className="flex justify-between items-center gap-4">
              <div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="flex h-[56px] items-center gap-2 text-[16px] font-semibold text-primary cursor-pointer"
                  >
                    {dir === "rtl" ? (
                      <ArrowRight size={18} className="text-primary" />
                    ) : (
                      <ArrowLeft size={18} className="text-primary" />
                    )}
                    {t("Back")}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="h-[56px] rounded-[5px] border border-primary px-[30px] py-4 text-[16px] font-semibold text-primary cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={primary.onClick}
                  disabled={primary.disabled}
                  className={primary.className}
                >
                  {primary.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCallOrderDialog;
