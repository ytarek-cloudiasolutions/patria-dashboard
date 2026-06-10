import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/i18n/useTranslation";
import MediaSvg from "@/assets/images/svgs/media.svg";
import ShapeSvg from "@/assets/images/svgs/shape.svg";
import TierBadge from "./TierBadge";
import type { Customer, CustomerFormData, CustomerTier } from "../types";

const makeTierOptions = (t: (s: string) => string): { label: string; value: CustomerTier }[] => [
  { label: t("Bronze (Standard)"), value: "Bronze" },
  { label: t("Silver (Pro)"), value: "Silver" },
  { label: t("Gold (Wholesale VIP)"), value: "Gold" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const formatEgp = (value: number) =>
  value === 0
    ? "EGP 0"
    : `EGP ${value.toLocaleString("en-US", {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;

interface EditCustomerDialogProps {
  open: boolean;
  customer?: Customer;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CustomerFormData, id: number) => void;
}

const EditCustomerDialog = ({
  open,
  customer,
  onOpenChange,
  onSave,
}: EditCustomerDialogProps) => {
  const { t } = useTranslation();
  const tierOptions = makeTierOptions(t);
  const [tier, setTier] = useState<CustomerTier>("Bronze");
  const [loyaltyPoints, setLoyaltyPoints] = useState("");
  const [isTierOpen, setIsTierOpen] = useState(false);

  useEffect(() => {
    if (customer) {
      setTier(customer.tier);
      setLoyaltyPoints(String(customer.loyaltyPoints));
    }
  }, [customer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    onSave(
      {
        tier,
        loyaltyPoints,
      },
      customer.id,
    );
    onOpenChange(false);
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        {/* Scrim/backdrop overlay when the Tier dropdown is open */}
        {isTierOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Edit Customer")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id="edit-customer-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
            noValidate
          >
            {/* Customer info card with stacked media + shape decorations */}
            <div className="relative mb-6 overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-[linear-gradient(114deg,rgba(255,255,255,0.08)_7.65%,rgba(143,105,0,0.20)_28.89%)] px-6 py-5">
              <img
                src={ShapeSvg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-1 top-0 h-full opacity-75"
              />
              <img
                src={MediaSvg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-2 h-[96%] opacity-90"
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar
                    size="lg"
                    className="bg-[#7A6518] text-white ring-2 ring-white"
                  >
                    <AvatarFallback className="bg-[#7A6518] text-[14px] font-semibold text-white">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                      {t("User Information")}
                    </p>
                    <p className="text-[18px] font-semibold text-[#28293D]">
                      {customer.name}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                      <div>
                        <p>{t("LTV")}</p>
                        <p className="mt-1 text-[14px] font-semibold normal-case tracking-normal text-[#059B5A]">
                          {formatEgp(customer.lifetimeValue)}
                        </p>
                      </div>
                      <div>
                        <p>{t("Orders")}</p>
                        <p className="mt-1 text-[14px] font-semibold normal-case tracking-normal text-[#059B5A]">
                          {formatEgp(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <TierBadge tier={customer.tier} />
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <Label
                  htmlFor="customer-tier"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Tier")}
                </Label>
                <DropdownSelect
                  options={tierOptions}
                  selected={tier}
                  onSelect={(value) => setTier(value as CustomerTier)}
                  onOpenChange={setIsTierOpen}
                  placeholder={t("Select tier")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>

              <InputField
                data={{
                  id: "loyalty-points",
                  label: {
                    htmlFor: "loyalty-points",
                    labelText: t("Loyalty Points"),
                  },
                  placeholder: t("e.g. 20"),
                  inputProps: {
                    type: "number",
                    min: "0",
                    value: loyaltyPoints,
                    onChange: (e) => setLoyaltyPoints(e.target.value),
                  },
                }}
              />
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
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
              <Button
                form="edit-customer-form"
                type="submit"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Save Edits")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
