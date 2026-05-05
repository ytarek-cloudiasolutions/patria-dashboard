import { Minus, Plus, ShoppingBag, ShoppingCart, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CartItem, OrderType } from "../types";
import { formatEgp } from "../utils";

type OrderCartProps = {
  orderType: OrderType;
  selectedTable: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  extrasTotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  onAddExtras: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onToggleAddon: (itemId: string, addonId: string) => void;
};

const OrderCart = ({
  orderType,
  selectedTable,
  items,
  itemCount,
  subtotal,
  extrasTotal,
  tax,
  total,
  onCheckout,
  onAddExtras,
  onRemoveItem,
  onUpdateQty,
  onToggleAddon,
}: OrderCartProps) => {
  const isCartEmpty = items.length === 0;

  return (
    <aside className="flex h-svh w-[312px] shrink-0 flex-col overflow-hidden border-l border-[#EDEBE7] bg-white">
      <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#EDEBE7] px-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#9B7200]">
            <ShoppingBag className="size-5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-4 text-[#1F2433]">
              Order Cart
            </p>
            <p className="text-[11px] text-[#7E7E7E]">
              {orderType === "dine-in" ? "Dine-in" : "Takeaway"}
              {orderType === "dine-in" ? ` - ${selectedTable}` : ""}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-[#9B7200] bg-[#FFF9EA] px-2 py-0.5 text-[11px] font-semibold text-[#9B7200]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {isCartEmpty ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#E5E2DD] bg-[#FCFBF8] px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#F5F0EA]">
              <ShoppingCart className="size-6 text-[#9B7200]" />
            </div>
            <p className="mt-4 text-[14px] font-semibold text-[#1F2433]">
              Cart is empty
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[#8B8B8B]">
              Add products from the menu to start a new order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[8px] border border-[#E5E2DD] bg-white p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#1F2433]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[9px] font-medium text-[#8B8B8B]">
                      {formatEgp(item.unitPrice)} / unit
                    </p>
                  </div>
                  <button
                    className="rounded-[4px] p-1 text-[#1F2433] hover:bg-[#F6F4F0]"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="size-6 rounded-[4px] border-[#E5E2DD] bg-[#FAFAFA]"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => onUpdateQty(item.id, -1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="min-w-4 text-center text-[12px] font-bold text-[#1F2433]">
                      {item.qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="size-6 rounded-[4px] border-[#E5E2DD] bg-[#FAFAFA]"
                      aria-label={`Increase ${item.name}`}
                      onClick={() => onUpdateQty(item.id, 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <p className="text-[12px] font-bold text-[#1F2433]">
                    {formatEgp(item.unitPrice * item.qty)}
                  </p>
                </div>

                {item.addons ? (
                  <div className="mt-4 rounded-[8px] border border-dashed border-[#C79B34] p-2">
                    <div className="space-y-2">
                      {item.addons.map((addon) => (
                        <button
                          key={addon.id}
                          className="flex w-full items-center justify-between gap-2 rounded-[4px] px-1 py-0.5 text-left text-[11px] text-[#575757]"
                          onClick={() => onToggleAddon(item.id, addon.id)}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-4 rounded-[4px] border border-[#C79B34]",
                                addon.selected ? "bg-[#FFF4D1]" : "bg-white"
                              )}
                            />
                            {addon.name}
                          </span>
                          <span className="font-semibold text-[#1F2433]">
                            {formatEgp(addon.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    className="mx-auto mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#9B7200]"
                    onClick={() => onAddExtras(item.id)}
                  >
                    <Plus className="size-4" />
                    Add Extras
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#EDEBE7] bg-white px-3 pb-7 pt-4">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-[#1F2433]">
            Order Notes
          </p>
          <Textarea
            placeholder="Special instructions..."
            className="min-h-11 rounded-[10px] border-[#E5E2DD] bg-white px-3 py-3 text-[12px] placeholder:text-[#A5A5A5] focus-visible:ring-0"
          />
        </div>

        <div className="mt-4 space-y-1 text-[12px]">
          <div className="flex items-center justify-between text-[#6F7280]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1F2433]">
              {formatEgp(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#6F7280]">
            <span>Extras</span>
            <span className="font-semibold text-[#1F2433]">
              {formatEgp(extrasTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#6F7280]">
            <span>Tax (14%)</span>
            <span className="font-semibold text-[#1F2433]">
              {formatEgp(tax)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex h-15 items-center justify-between rounded-[8px] border border-[#21BF73] bg-[#E4F8EF] px-3 text-[#079561]">
          <span className="text-[12px] font-bold uppercase">Total</span>
          <span className="text-[18px] font-bold">{formatEgp(total)}</span>
        </div>

        <Button
          className="mt-5 h-12 w-full rounded-[4px] bg-[#9B7200] text-[13px] font-bold uppercase text-white hover:bg-[#856100]"
          disabled={isCartEmpty}
          onClick={onCheckout}
        >
          <ShoppingCart className="size-4" />
          Checkout
        </Button>
      </div>
    </aside>
  );
};

export default OrderCart;
