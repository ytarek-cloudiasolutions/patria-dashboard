import { MapPin, Phone, RotateCcw, Search, UserPlus, UserRound } from "lucide-react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CustomerAddress, CustomerLookup, DeliveryZone } from "../types";

interface CallCustomerStepProps {
  phoneQuery: string;
  onPhoneQueryChange: (value: string) => void;
  onSearch: () => void;
  searched: boolean;
  existing: CustomerLookup | null;
  selectedAddressId?: string | null;
  onSelectAddress?: (address: CustomerAddress) => void;
  onUseDifferentAddress?: () => void;
  onUseDifferentNumber?: () => void;
  onRetrieveCustomerNumber?: () => void;
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
  selectedAddressId,
  onSelectAddress,
  onUseDifferentAddress,
  onUseDifferentNumber,
  onRetrieveCustomerNumber,
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

  const isDifferentNumber = Boolean(existing && phone !== existing.phone);

  const handleNumberAction = () => {
    if (isDifferentNumber) {
      if (onRetrieveCustomerNumber) {
        onRetrieveCustomerNumber();
      } else if (existing?.phone) {
        onPhoneChange(existing.phone);
      }
    } else {
      onUseDifferentNumber?.();
    }
  };

  const zoneOptions = deliveryZones.map((zone) => ({
    value: zone.id,
    label: `${zone.name} - EGP ${zone.deliveryFee} - Min Order EGP ${zone.minOrder}`,
  }));

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Phone lookup */}
      <div className="flex flex-col gap-2.5 w-full min-w-0">
        <label className="text-[16px] font-medium text-black">
          {t("Find the customer by phone number")}
        </label>
        <div className="flex items-center gap-6 w-full min-w-0">
          <input
            id="call-phone-search"
            type="text"
            placeholder="e.g 012X XXXX XXXX"
            value={phoneQuery}
            dir="ltr"
            disabled={isSearching}
            onChange={(e) => onPhoneQueryChange(e.target.value)}
            className="h-[50px] flex-1 min-w-0 rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
        <div className="flex flex-col gap-2 rounded-[10px] bg-[#E2F4ED] p-3.5 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <UserRound className="size-5 text-[#059B5A] shrink-0" />
              <span className="text-[16px] font-semibold tracking-[0.32px] text-[#059B5A] whitespace-nowrap">
                {t("Existing Customer")}
              </span>
            </div>
            <span className="shrink-0 rounded-[30px] border border-[#053CB8] bg-[#EDF4FB] px-3 py-1 text-[11px] font-semibold tracking-[0.22px] text-[#3574FF] uppercase whitespace-nowrap">
              {existing.tier.toUpperCase().includes("STANDARD")
                ? existing.tier.toUpperCase()
                : `${existing.tier.toUpperCase()} (STANDARD)`}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[12px] w-full min-w-0">
            <div className="flex items-center gap-1.5 w-full min-w-0">
              <span className="shrink-0 font-semibold text-[#595959] whitespace-nowrap">{t("Name")}:</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-[#333333]">{existing.name}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 w-full min-w-0 ${
                isDifferentNumber ? "cursor-pointer group hover:opacity-85" : ""
              }`}
              onClick={isDifferentNumber ? handleNumberAction : undefined}
              title={isDifferentNumber ? t("Retrieve customer's number") : undefined}
            >
              <span className="shrink-0 font-semibold text-[#595959] whitespace-nowrap">{t("Phone Number")}:</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-[#333333]" dir="ltr">{existing.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 w-full min-w-0">
              <span className="shrink-0 font-semibold text-[#595959] whitespace-nowrap">{t("Last Saved Address")}:</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-[#333333]" title={existing.lastAddress}>{existing.lastAddress}</span>
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onUseDifferentAddress}
              className="flex items-center gap-1.5 rounded-[16px] bg-white/40 px-3 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-white/60 cursor-pointer"
            >
              <MapPin className="size-[18px] text-black" />
              <span>{t("Use a different address")}</span>
            </button>
            <button
              type="button"
              onClick={handleNumberAction}
              className="flex items-center gap-1.5 rounded-[16px] bg-white/40 px-3 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-white/60 cursor-pointer"
            >
              {isDifferentNumber ? (
                <>
                  <RotateCcw className="size-[16px] text-black" />
                  <span>{t("Retrieve customer's number")}</span>
                </>
              ) : (
                <>
                  <Phone className="size-[18px] text-black" />
                  <span>{t("Use a different number")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {searched && !existing && (
        <div className="rounded-[12px] bg-[#F1F1F1] p-4 w-full min-w-0">
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
      <div className="grid gap-6 sm:grid-cols-2 w-full min-w-0">
        <div className="flex flex-col gap-2.5 min-w-0">
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

        <div className="flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between">
            <label htmlFor="call-customer-phone" className="text-[16px] font-medium text-black">
              {t("Phone Number")} <span className="text-[#C90000]">*</span>
            </label>
            {isDifferentNumber && existing?.phone && (
              <button
                type="button"
                onClick={handleNumberAction}
                className="flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3 text-primary" />
                <span>{t("Retrieve customer's number")}</span>
              </button>
            )}
          </div>
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

      {/* Saved Addresses */}
      {searched && existing && existing.addresses && existing.addresses.length > 0 && (
        <div className="flex flex-col gap-2.5 w-full min-w-0">
          <label className="text-[16px] font-medium text-black">
            {t("Saved Addresses")}
          </label>
          <div className="flex flex-col gap-4 w-full min-w-0">
            {existing.addresses.map((addr, idx) => {
              const id = addr._id || addr.id || String(idx);
              const isSelected = selectedAddressId === id;
              const subtitleParts: string[] = [];
              if (addr.street) subtitleParts.push(addr.street);
              if (addr.floor) subtitleParts.push(`floor ${addr.floor}`);
              if (addr.apartmentNo) subtitleParts.push(`Apartment no. ${addr.apartmentNo}`);
              if (addr.buildingName) subtitleParts.push(`Building ${addr.buildingName}`);
              const subtitle =
                subtitleParts.length > 0
                  ? subtitleParts.join(", ")
                  : addr.details || addr.area || addr.city || "";

              return (
                <div
                  key={id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectAddress?.(addr)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectAddress?.(addr);
                    }
                  }}
                  className={`flex w-full min-w-0 cursor-pointer items-center justify-between rounded-[12px] px-4 py-[18px] transition-colors border-2 gap-3 ${
                    isSelected
                      ? "bg-[#F5F0EA] border-primary"
                      : "bg-[#FAFAF7] border-[#E5E5E5] hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 text-start min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[14px] font-semibold text-black truncate">
                        {addr.label || t("Address")}
                        {addr.isDefault && (
                          <span className="font-semibold">{`, ${t("Default")}`}</span>
                        )}
                      </span>
                      <span className="text-[14px] font-bold text-black shrink-0">-</span>
                      <span className="text-[14px] font-bold text-black truncate">
                        {addr.zone || addr.area || ""}
                      </span>
                    </div>
                    {subtitle && (
                      <div className="text-[12px] font-normal text-black truncate" title={subtitle}>
                        {subtitle}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-[30px] border border-[#004EF9] bg-[#EDF4FB] px-3 py-1">
                    <span className="text-[13px] font-semibold text-[#3574FF]">
                      {addr.source || "App"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5 w-full min-w-0">
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

      <div className="flex flex-col gap-2.5 w-full min-w-0">
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
