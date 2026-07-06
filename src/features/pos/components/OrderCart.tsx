import {
  Minus,
  Pencil,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartItem, CartTotals, OrderType } from "../types";
import { formatEgp, lineTotal } from "../utils";

type OrderCartProps = {
  orderType: OrderType;
  selectedTable: string;
  customer: string;
  items: CartItem[];
  totals: CartTotals;
  notes: string;
  sentToKitchen: boolean;
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
  const isCartEmpty = items.length === 0;
  const showSendToKitchen = orderType === "dine-in" && !sentToKitchen;

  return (
    <aside className="flex h-svh w-[330px] shrink-0 flex-col overflow-hidden border-s border-[#EDEBE7] bg-white">
      {/* Customer search */}
      <div className="shrink-0 px-4 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-[#8B8B8B]" />
          <input
            value={customer}
            onChange={(event) => onCustomerChange(event.target.value)}
            placeholder={t("Search for a customer")}
            className="h-10 w-full rounded-[8px] border border-[#E5E2DD] bg-white ps-9 pe-3 text-[12px] text-[#333333] outline-none placeholder:text-[#8B8B8B] focus:border-primary/50"
          />
        </div>
      </div>

      {/* Cart header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary">
            <ShoppingBag className="size-4.5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-4 text-[#333333]">
              {t("Order Cart")}
            </p>
            <p className="text-[11px] text-[#7E7E7E]">
              {orderType === "dine-in"
                ? `${t("Dine-in")} - ${selectedTable}`
                : t("Takeaway")}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-primary bg-[#FFF9EA] px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          {totals.itemCount} {totals.itemCount === 1 ? t("item") : t("items")}
        </span>
      </div>

      {/* Cart items */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        {isCartEmpty ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#E5E2DD] bg-[#FCFBF8] px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#F5F0EA]">
              <ShoppingCart className="size-6 text-primary" />
            </div>
            <p className="mt-4 text-[14px] font-semibold text-[#333333]">
              {t("Cart is empty")}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[#8B8B8B]">
              {t("Add products from the menu to start a new order.")}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="rounded-[10px] border border-[#EDEBE7] bg-white p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-[#333333]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-[#8B8B8B]">
                      {formatEgp(item.unitPrice)} / {t("unit")}
                    </p>
                  </div>
                  <button
                    className="rounded-[4px] p-1 text-[#595959] hover:bg-[#F6F4F0]"
                    aria-label={`${t("Remove")} ${item.name}`}
                    onClick={() => onRemoveItem(item.lineId)}
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex size-7 items-center justify-center rounded-[6px] border border-[#E5E2DD] bg-[#FAFAFA] text-[#333333] hover:bg-[#F2F0EC]"
                      aria-label={`${t("Decrease")} ${item.name}`}
                      onClick={() => onUpdateQty(item.lineId, -1)}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="min-w-5 text-center text-[12px] font-bold text-[#333333]">
                      {item.qty}
                    </span>
                    <button
                      className="flex size-7 items-center justify-center rounded-[6px] border border-[#E5E2DD] bg-[#FAFAFA] text-[#333333] hover:bg-[#F2F0EC]"
                      aria-label={`${t("Increase")} ${item.name}`}
                      onClick={() => onUpdateQty(item.lineId, 1)}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <p className="text-[12px] font-bold text-[#333333]">
                    {formatEgp(lineTotal(item))}
                  </p>
                </div>

                {item.extras.length > 0 && (
                  <div className="mt-3 rounded-[8px] border border-dashed border-primary/60 p-2.5">
                    <div className="space-y-2">
                      {item.extras.map((extra) => (
                        <label
                          key={extra.id}
                          className="flex w-full cursor-pointer items-center justify-between gap-2 text-[11px] text-[#575757]"
                        >
                          <span className="flex items-center gap-2">
                            <Checkbox
                              checked={extra.selected}
                              onCheckedChange={() =>
                                onToggleExtra(item.lineId, extra.id)
                              }
                            />
                            {extra.name}
                          </span>
                          <span className="font-semibold text-[#333333]">
                            {formatEgp(extra.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                    <button
                      className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-primary"
                      onClick={() => onEditItem(item.lineId)}
                    >
                      <Pencil className="size-3.5" />
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
      <div className="shrink-0 border-t border-[#EDEBE7] bg-white px-4 pb-5 pt-4">
        <p className="mb-2 text-[13px] font-semibold text-[#333333]">
          {t("Order Notes")}
        </p>
        <Textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder={t("Special instructions...")}
          className="min-h-11 rounded-[10px] border-[#E5E2DD] bg-white px-3 py-2.5 text-[12px] placeholder:text-[#A5A5A5] focus-visible:ring-0"
        />

        <div className="mt-4 space-y-1.5 text-[12px]">
          <div className="flex items-center justify-between text-[#8B8B8B]">
            <span>{t("Subtotal")}</span>
            <span className="font-semibold text-[#333333]">
              {formatEgp(totals.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#8B8B8B]">
            <span>{t("Extras")}</span>
            <span className="font-semibold text-[#333333]">
              {formatEgp(totals.extras)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#8B8B8B]">
            <span>{t("Tax (14%)")}</span>
            <span className="font-semibold text-[#333333]">
              {formatEgp(totals.tax)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex h-14 items-center justify-between rounded-[10px] border border-[#21BF73] bg-[#E4F8EF] px-4 text-[#079561]">
          <span className="text-[12px] font-bold uppercase">{t("Total")}</span>
          <span className="text-[18px] font-bold">{formatEgp(totals.total)}</span>
        </div>

        {showSendToKitchen ? (
          <button
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-primary text-[13px] font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={isCartEmpty}
            onClick={onSendToKitchen}
          >
            <Send className="size-4" />
            {t("Send to Kitchen")}
          </button>
        ) : (
          <div className="mt-4 space-y-2.5">
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-primary text-[13px] font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              disabled={isCartEmpty}
              onClick={onCheckout}
            >
              <ShoppingCart className="size-4" />
              {t("Checkout")}
            </button>
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-primary bg-white text-[12px] font-bold uppercase text-primary transition-colors hover:bg-[#FBF6EE] disabled:opacity-50"
              disabled={isCartEmpty}
              onClick={onDeductFromEmployee}
            >
              <UserRound className="size-4" />
              {t("Deduct from Employee Account")}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OrderCart;
