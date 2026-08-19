import { useState } from "react";
import {
  Loader2,
  Minus,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  SquarePen,
  Star,
  Trophy,
  User,
  UserRound,
  X,
} from "lucide-react";

import { api } from "@/config/api";
import TierBadge from "@/features/customers/components/TierBadge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartItem, CartTotals, OrderType, PosCustomer } from "../types";
import { formatEgp, lineTotal } from "../utils";

type OrderCartProps = {
  orderType: OrderType;
  selectedTable: string;
  customer: string;
  items: CartItem[];
  totals: CartTotals;
  notes: string;
  sentToKitchen: boolean;
  customerCount?: number;
  onCustomerChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onRemoveItem: (lineId: string) => void;
  onUpdateQty: (lineId: string, delta: number) => void;
  onToggleExtra: (lineId: string, extraId: string) => void;
  onEditItem: (lineId: string) => void;
  onSendToKitchen: () => void;
  onCheckout: () => void;
  onDeductFromEmployee: () => void;
};

const OrderCart = ({
  orderType,
  selectedTable,
  customer,
  items,
  totals,
  notes,
  sentToKitchen,
  customerCount = 0,
  onCustomerChange,
  onNotesChange,
  onRemoveItem,
  onUpdateQty,
  onToggleExtra,
  onEditItem,
  onSendToKitchen,
  onCheckout,
  onDeductFromEmployee,
}: OrderCartProps) => {
  const { t } = useTranslation();
  const [phoneQuery, setPhoneQuery] = useState(customer);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const isCartEmpty = items.length === 0;
  const showSendToKitchen = orderType === "dine-in" && !sentToKitchen;
  const isActionDisabled = isCartEmpty || (orderType === "dine-in" && !selectedTable);

  const handleCustomerSearch = async () => {
    const normalized = phoneQuery.replace(/\s+/g, "").trim();
    if (!normalized) return;

    setIsSearchingCustomer(true);
    setSearchError(null);

    try {
      const response = await api.get(`/customers/by-phone/${normalized}`);
      const raw = response.data?.data ?? response.data?.customer ?? response.data;
      const c = Array.isArray(raw) ? raw[0] : raw;

      if (c && (c.name || c.phone || c._id)) {
        const found: PosCustomer = {
          id: c._id || c.id || "cust-1",
          name: c.name || "Customer",
          phone: c.phone || normalized,
          email: c.email,
          tier: c.tier || "Bronze",
          loyaltyPoints: c.loyaltyPoints ?? 0,
        };
        setSelectedCustomer(found);
        onCustomerChange(found.name);
        setSearchError(null);
      } else {
        setSelectedCustomer(null);
        setSearchError(t("No customer found with this phone number"));
      }
    } catch (err: any) {
      setSelectedCustomer(null);
      setSearchError(t("No customer found with this phone number"));
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  return (
    <aside className="flex h-svh w-[351px] shrink-0 flex-col overflow-hidden border-s border-[#E5E5E5] bg-white py-5">
      {/* Customer search & profile section */}
      <div className="shrink-0 px-3 pb-3">
        {selectedCustomer ? (
          /* Selected Customer Card */
          <div className="flex flex-col gap-2 rounded-[12px] border border-[#8F6900] bg-[#F8F8F8] p-[14px]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-[13px] min-w-0 flex-1">
                <div className="flex items-center gap-1 min-w-0">
                  <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#8F6900]">
                    <User className="size-5 text-white" />
                  </div>
                  <span className="truncate text-[14px] font-semibold tracking-[0.28px] leading-[15px] text-[#333333]">
                    {selectedCustomer.name}
                  </span>
                </div>
                {selectedCustomer.tier && (
                  <TierBadge tier={selectedCustomer.tier} />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  setPhoneQuery("");
                  onCustomerChange("");
                }}
                className="p-0.5 text-black transition-colors hover:text-[#8F6900] cursor-pointer"
                aria-label={t("Remove customer")}
              >
                <X className="size-[18px] text-black" />
              </button>
            </div>

            <div className="w-full border-t border-[#CACBD4]" />

            <div className="flex h-9 items-center justify-between text-[12px]">
              <div className="flex items-center gap-1 font-medium tracking-[0.24px] text-black">
                <Phone className="size-4 text-black" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-1 font-bold tracking-[0.24px] text-[#8F6900]">
                <Trophy className="size-4 text-[#8F6900]" />
                <span>
                  {selectedCustomer.loyaltyPoints} {t("Points")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Customer Search Input */
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex flex-1 items-center">
                <Phone className="pointer-events-none absolute start-3.5 size-4 text-[#8B8B8B]" />
                <input
                  value={phoneQuery}
                  onChange={(event) => {
                    setPhoneQuery(event.target.value);
                    onCustomerChange(event.target.value);
                    if (searchError) setSearchError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleCustomerSearch();
                    }
                  }}
                  placeholder={t("Search by phone number")}
                  className="h-[46px] w-full rounded-[8px] border border-[#CACBD4] bg-white ps-10 pe-3 text-[14px] text-[#333333] outline-none placeholder:text-[#8B8B8B] focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleCustomerSearch}
                disabled={isSearchingCustomer || !phoneQuery.trim()}
                className="flex h-[46px] items-center justify-center rounded-[8px] bg-[#8F6900] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isSearchingCustomer ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  t("Search")
                )}
              </button>
            </div>
            {searchError && (
              <p className="text-[11px] font-medium text-[#C90000] px-1">
                {searchError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cart header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-3 pb-3 pt-2">
        <div className="flex items-center gap-[13px]">
          <div className="flex size-[36px] items-center justify-center rounded-full bg-[#8F6900]">
            <ShoppingBag className="size-5 text-white" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-[14px] font-semibold leading-[14.98px] tracking-[0.28px] text-[#333333]">
              {t("Order Cart")}
            </p>
            <p className="text-[12px] font-semibold leading-[16.80px] tracking-[0.24px] text-[#8B8B8B]">
              {orderType === "dine-in"
                ? `${t("Dine-in")} · ${selectedTable || t("No Table Selected")}`
                : t("Takeaway")}
            </p>
          </div>
        </div>
        <span className="rounded-[30px] border border-[#8F6900] bg-[#F5F0EA] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#8F6900]">
          {totals.itemCount} {totals.itemCount === 1 ? t("item") : t("items")}
        </span>
      </div>

      {/* Cart items */}
      <div className="min-h-0 flex-1 overflow-y-auto border-b border-[#E5E5E5] px-3 py-3">
        {isCartEmpty ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#E5E2DD] bg-[#FAFAF7] px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#F5F0EA]">
              <ShoppingCart className="size-6 text-[#8F6900]" />
            </div>
            <p className="mt-4 text-[14px] font-semibold text-[#333333]">
              {t("Cart is empty")}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[#8B8B8B]">
              {t("Add products from the menu to start a new order.")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="flex flex-col gap-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold leading-[13.91px] tracking-[0.26px] text-[#333333]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold leading-[14px] tracking-[0.20px] text-[#8B8B8B]">
                      {formatEgp(item.unitPrice)} / {t("unit")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-black transition-opacity hover:opacity-70 cursor-pointer"
                    aria-label={`${t("Remove")} ${item.name}`}
                    onClick={() => onRemoveItem(item.lineId)}
                  >
                    <X className="size-[18px] text-black" />
                  </button>
                </div>

                <div className="flex h-[36px] items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-colors hover:bg-gray-50 cursor-pointer"
                      aria-label={`${t("Decrease")} ${item.name}`}
                      onClick={() => onUpdateQty(item.lineId, -1)}
                    >
                      <Minus className="size-3.5 text-black" />
                    </button>
                    <span className="min-w-4 text-center text-[13px] font-bold tracking-[0.26px] text-black">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-colors hover:bg-gray-50 cursor-pointer"
                      aria-label={`${t("Increase")} ${item.name}`}
                      onClick={() => onUpdateQty(item.lineId, 1)}
                    >
                      <Plus className="size-3.5 text-black" />
                    </button>
                  </div>
                  <p className="text-[13px] font-medium tracking-[0.26px] text-black">
                    EGP{" "}
                    <span className="font-normal">
                      {lineTotal(item).toFixed(2)}
                    </span>
                  </p>
                </div>

                {item.extras.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="rounded-[16px] border border-dashed border-[#8F6900] bg-[#FAFAF7] p-3 space-y-2">
                      {item.extras.map((extra) => (
                        <label
                          key={extra.id}
                          className="flex w-full cursor-pointer items-center justify-between gap-2 text-[13px]"
                        >
                          <span className="flex items-center gap-2 text-[13px] font-medium text-[#333333]">
                            <Checkbox
                              checked={extra.selected}
                              onCheckedChange={() =>
                                onToggleExtra(item.lineId, extra.id)
                              }
                            />
                            {extra.name}
                          </span>
                          <span className="text-[13px] font-medium text-black">
                            EGP <span className="font-semibold">{extra.price.toFixed(2)}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[5px] text-[12px] font-semibold leading-[16.80px] tracking-[0.24px] text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
                      onClick={() => onEditItem(item.lineId)}
                    >
                      <SquarePen className="size-4.5 text-[#8F6900]" />
                      {t("Edit")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: notes, totals, actions */}
      <div className="shrink-0 space-y-4 px-3 pt-3">
        {/* Order Notes */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[16px] font-medium text-black">
            {t("Order Notes")}
          </label>
          <input
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder={t("Special instructions...")}
            className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] font-normal text-[#333333] outline-none placeholder:text-[#8B8B8B] focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
          />
        </div>

        {/* Subtotal, Extras, Tax */}
        <div className="space-y-2 text-[14px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#8B8B8B] leading-[15.40px]">
              {t("Subtotal")}
            </span>
            <span className="font-semibold text-[#23252A] leading-[15.40px]">
              EGP {totals.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#8B8B8B] leading-[15.40px]">
              {t("Extras")}
            </span>
            <span className="font-semibold text-[#23252A] leading-[15.40px]">
              EGP {totals.extras.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#8B8B8B] leading-[15.40px]">
              {t("Tax (14%)")}
            </span>
            <span className="font-semibold text-[#23252A] leading-[15.40px]">
              EGP {totals.tax.toFixed(2)}
            </span>
          </div>
        </div>

        {orderType === "dine-in" && customerCount > 1 && (
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-semibold text-[#8B8B8B] leading-[15.40px]">
              {t("Cost per person")} ({customerCount})
            </span>
            <span className="font-semibold text-[#23252A] leading-[15.40px]">
              EGP {(totals.total / customerCount).toFixed(2)}
            </span>
          </div>
        )}

        {/* Grand Total Box */}
        <div className="flex h-[66px] items-center justify-between rounded-[16px] border border-[#059B5A] bg-[#E2F4ED] px-3.5 py-6">
          <span className="text-[14px] font-semibold uppercase leading-[15.40px] text-[#059B5A]">
            {t("TOTAL")}
          </span>
          <span className="text-[20px] font-bold leading-[22px] text-[#059B5A]">
            EGP {totals.total.toFixed(2)}
          </span>
        </div>

        {/* Action buttons */}
        {showSendToKitchen ? (
          <button
            type="button"
            className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[5px] bg-[#8F6900] px-[30px] py-4 text-[16px] font-semibold uppercase leading-6 text-white transition-colors hover:bg-[#8F6900]/90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            disabled={isActionDisabled}
            onClick={onSendToKitchen}
          >
            <Send className="size-[18px] text-white" />
            {t("Send to kitchen")}
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[5px] bg-[#8F6900] px-[30px] py-4 text-[16px] font-semibold uppercase leading-6 text-white transition-colors hover:bg-[#8F6900]/90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              disabled={isActionDisabled}
              onClick={onCheckout}
            >
              <ShoppingCart className="size-[18px] text-white" />
              {t("Checkout")}
            </button>
            <button
              type="button"
              className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#F5F0EA] px-2 py-4 text-[12px] font-bold tracking-[0.2px] uppercase leading-6 text-[#8F6900] whitespace-nowrap transition-colors hover:bg-[#EFE7DC] disabled:opacity-50 disabled:pointer-events-none cursor-pointer sm:text-[13px]"
              disabled={isActionDisabled}
              onClick={onDeductFromEmployee}
            >
              <UserRound className="size-4.5 shrink-0 text-[#8F6900]" />
              <span className="whitespace-nowrap">{t("DEDUCT FROM EMPLOYEE ACC.")}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OrderCart;
