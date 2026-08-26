import { Search, UserPlus, UserRound } from "lucide-react";

import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import InputField from "@/shared/components/InputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CustomerLookup, DeliveryZone } from "../types";

interface CallCustomerStepProps {
  phoneQuery: string;
  onPhoneQueryChange: (value: string) => void;
  onSearch: () => void;
  searched: boolean;
  existing: CustomerLookup | null;
  name: string;
  onNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
  zoneId: string;
  onZoneChange: (value: string) => void;
  onZoneMenuOpenChange?: (open: boolean) => void;
  deliveryZones: DeliveryZone[];
  isSearching?: boolean;
  errors?: Record<string, string>;
}

const CallCustomerStep = ({
  phoneQuery,
  onPhoneQueryChange,
  onSearch,
  searched,
  existing,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  address,
  onAddressChange,
  zoneId,
  onZoneChange,
  onZoneMenuOpenChange,
  deliveryZones,
  isSearching = false,
  errors = {},
}: CallCustomerStepProps) => {
  const { t } = useTranslation();

  const zoneOptions = deliveryZones.map((zone) => ({
    value: zone.id,
    label: `${zone.name} - EGP ${zone.deliveryFee} - Min Order EGP ${zone.minOrder}`,
  }));

  return (
    <div className="space-y-6">
      {/* Phone lookup */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[16px] font-medium text-black">
          {t("Find the customer by phone number")}
        </label>
        <div className="flex items-center gap-6">
          <input
            id="call-phone-search"
            type="text"
            placeholder="e.g 012X XXXX XXXX"
            value={phoneQuery}
            dir="ltr"
            disabled={isSearching}
            onChange={(e) => onPhoneQueryChange(e.target.value)}
            className="h-[50px] flex-1 rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            disabled={isSearching}
            onClick={onSearch}
            className="flex h-[56px] shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-primary px-[30px] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            <Search className="size-[18px]" />
            {isSearching ? t("Searching...") : t("Search")}
          </button>
        </div>
      </div>

      {/* Lookup result banner */}
      {searched && existing && (
        <div className="flex flex-col gap-2 rounded-[10px] bg-[#E2F4ED] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-black" />
              <span className="text-[16px] font-semibold tracking-[0.32px] text-[#059B5A]">
                {t("Existing Customer")}
              </span>
            </div>
            <span className="rounded-[30px] border border-[#053CB8] bg-[#EDF4FB] px-3 py-1 text-[11px] font-semibold tracking-[0.22px] text-[#3574FF] uppercase">
              {existing.tier} (STANDARD)
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[12px]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#595959]">{t("Name")}:</span>
              <span className="font-semibold text-[#333333]">{existing.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#595959]">{t("Phone Number")}:</span>
              <span className="font-semibold text-[#333333]" dir="ltr">{existing.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#595959]">{t("Last Saved Address")}:</span>
              <span className="font-semibold text-[#333333]">{existing.lastAddress}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onNameChange("");
              onPhoneChange("");
              onAddressChange("");
            }}
            className="mt-1 flex w-fit items-center gap-1.5 border-b border-black pb-1 pt-2 text-[12px] font-semibold text-black hover:opacity-80 transition-opacity cursor-pointer"
          >
            <UserPlus className="size-[18px] text-black" />
            {t("Use a different address or number for this order")}
          </button>
        </div>
      )}

      {searched && !existing && (
        <div className="rounded-[12px] bg-[#F1F1F1] p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-[#333333]">
            <UserPlus className="size-4" />
            {t("New customer")}
          </p>
          <p className="mt-1 text-[12px] text-[#8B8B8B]">
            {t("Complete the information below to create the order")}
          </p>
        </div>
      )}

      {/* Customer form */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="call-customer-name" className="text-[16px] font-medium text-black">
            {t("Customer Name")} <span className="text-[#C90000]">*</span>
          </label>
          <input
            id="call-customer-name"
            type="text"
            placeholder={t("Full Name")}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`h-[50px] w-full rounded-[12px] border bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:outline-none focus:ring-1 ${
              errors.name
                ? "border-[#C90000] focus:border-[#C90000] focus:ring-[#C90000]"
                : "border-[#E5E5E5] focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.name && (
            <p className="text-[13px] font-medium text-[#C90000]">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="call-customer-phone" className="text-[16px] font-medium text-black">
            {t("Phone Number")} <span className="text-[#C90000]">*</span>
          </label>
          <input
            id="call-customer-phone"
            type="text"
            placeholder="01X XXXX XXXX"
            value={phone}
            dir="ltr"
            onChange={(e) => onPhoneChange(e.target.value)}
            className={`h-[50px] w-full rounded-[12px] border bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:outline-none focus:ring-1 ${
              errors.phone
                ? "border-[#C90000] focus:border-[#C90000] focus:ring-[#C90000]"
                : "border-[#E5E5E5] focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.phone && (
            <p className="text-[13px] font-medium text-[#C90000]">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label htmlFor="call-customer-address" className="text-[16px] font-medium text-black">
          {t("Detailed address")} <span className="text-[#C90000]">*</span>
        </label>
        <input
          id="call-customer-address"
          type="text"
          placeholder={t("e.g Kafr Abdo")}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className={`h-[50px] w-full rounded-[12px] border bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:outline-none focus:ring-1 ${
            errors.address
              ? "border-[#C90000] focus:border-[#C90000] focus:ring-[#C90000]"
              : "border-[#E5E5E5] focus:border-primary focus:ring-primary"
          }`}
        />
        {errors.address && (
          <p className="text-[13px] font-medium text-[#C90000]">{errors.address}</p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[16px] font-medium text-black">
          {t("Zone")} <span className="text-[#C90000]">*</span>
        </label>
        <DropdownSelect
          options={zoneOptions}
          selected={zoneId}
          onSelect={onZoneChange}
          onOpenChange={onZoneMenuOpenChange}
          placeholder={t("Select Zone")}
          align="start"
          className={`md:w-full h-[50px] rounded-[12px] text-[16px] ${
            errors.zone ? "border-[#C90000]" : "border-[#E5E5E5]"
          }`}
          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
        />
        {errors.zone && (
          <p className="text-[13px] font-medium text-[#C90000]">{errors.zone}</p>
        )}
      </div>
    </div>
  );
};

export default CallCustomerStep;
