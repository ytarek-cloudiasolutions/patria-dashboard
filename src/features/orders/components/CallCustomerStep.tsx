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
}: CallCustomerStepProps) => {
  const { t } = useTranslation();

  const zoneOptions = deliveryZones.map((zone) => ({
    value: zone.id,
    label: `${zone.name} - EGP ${zone.deliveryFee} - Min Order EGP ${zone.minOrder}`,
  }));

  return (
    <div className="space-y-5">
      {/* Phone lookup */}
      <div>
        <Label className="mb-2.5 block text-[15px] font-medium text-black">
          {t("Find the customer by phone number")}
        </Label>
        <div className="flex items-stretch gap-2.5">
          <InputField
            id="call-phone-search"
            placeholder="e.g 012X XXXX XXXX"
            wrapperClassName="flex-1"
            inputProps={{
              value: phoneQuery,
              dir: "ltr",
              onChange: (e) => onPhoneQueryChange(e.target.value),
            }}
          />
          <Button
            type="button"
            onClick={onSearch}
            className="flex h-12.5 shrink-0 cursor-pointer items-center gap-2 rounded-[8px] px-5 text-[14px] font-semibold text-white"
          >
            <Search className="size-4" />
            {t("Search")}
          </Button>
        </div>
      </div>

      {/* Lookup result banner */}
      {searched && existing && (
        <div className="rounded-[12px] border border-[#059B5A]/30 bg-[#E2F4ED] p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-[#059B5A]">
              <UserRound className="size-4" />
              {t("Existing Customer")}
            </p>
            <span className="rounded-full border border-[#3357B5]/30 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#3357B5]">
              {existing.tier}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-[12px] text-[#333333]">
            <p>
              <span className="font-semibold">{t("Name")}:</span> {existing.name}
            </p>
            <p>
              <span className="font-semibold">{t("Phone Number")}:</span>{" "}
              <span dir="ltr">{existing.phone}</span>
            </p>
            <p>
              <span className="font-semibold">{t("Last Saved Address")}:</span>{" "}
              {existing.lastAddress}
            </p>
          </div>
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
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          id="call-customer-name"
          label={t("Customer Name")}
          required
          placeholder={t("Full Name")}
          inputProps={{
            value: name,
            onChange: (e) => onNameChange(e.target.value),
          }}
        />
        <InputField
          id="call-customer-phone"
          label={t("Phone Number")}
          required
          placeholder="01X XXXX XXXX"
          inputProps={{
            value: phone,
            dir: "ltr",
            onChange: (e) => onPhoneChange(e.target.value),
          }}
        />
      </div>

      <InputField
        id="call-customer-address"
        label={t("Detailed address")}
        required
        placeholder={t("e.g Kafr Abdo")}
        inputProps={{
          value: address,
          onChange: (e) => onAddressChange(e.target.value),
        }}
      />

      <div className="flex flex-col">
        <Label className="mb-2.5 text-[16px] font-medium text-black">
          {t("Zone")}
          <span className="text-[#C90000]">*</span>
        </Label>
        <DropdownSelect
          options={zoneOptions}
          selected={zoneId}
          onSelect={onZoneChange}
          onOpenChange={onZoneMenuOpenChange}
          placeholder={t("Select Zone")}
          align="start"
          className="md:w-full"
          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
        />
      </div>
    </div>
  );
};

export default CallCustomerStep;
