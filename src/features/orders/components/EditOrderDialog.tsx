import { useState } from "react";
import {
  Banknote,
  Check,
  CreditCard,
  Minus,
  Plus,
  SquarePen,
  Trash2,
  WalletCards,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { api } from "@/config/api";
import OrdersStatusBadge from "./OrdersStatusBadge";
import ProductCustomizationModal from "./ProductCustomizationModal";
import { mapOrderStatusToBackend } from "../utils/orderMappers";
import type {
  CartLineItem,
  Order,
  OrderLineItem,
  OrderStatus,
  ProductOption,
} from "../types";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "On The Way",
  "Delivered",
  "Cancelled",
];

const PAYMENT_METHODS = [
  { value: "Cash", Icon: Banknote },
  { value: "Visa/Card", Icon: CreditCard },
  { value: "Mix", Icon: WalletCards },
] as const;

type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

const normalizePaymentMethod = (raw: string): PaymentMethodValue => {
  const value = (raw || "").toLowerCase();
  const hasCash = value.includes("cash");
  const hasCard =
    value.includes("visa") ||
    value.includes("card") ||
    value.includes("online");
  if (value.includes("mix") || (hasCash && hasCard) || value.includes("+")) {
    return "Mix";
  }
  if (hasCard) return "Visa/Card";
  return "Cash";
};

interface EditOrderDialogProps {
  order: Order;
  products: ProductOption[];
  onOpenChange: (open: boolean) => void;
  onSaved: (order: Order) => void;
}

const EditOrderDialog = ({
  order,
  products,
  onOpenChange,
  onSaved,
}: EditOrderDialogProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>(
    normalizePaymentMethod(order.paymentMethod),
  );
  const [items, setItems] = useState<OrderLineItem[]>(order.items);
  const [editingItemId, setEditingItemId] = useState<string | number | null>(
    null,
  );
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const displayId = order.orderId || order.id;
  const canRemoveItems = status !== "On The Way";

  const getProduct = (item: OrderLineItem) =>
    products.find(
      (product) =>
        String(product.id) === String(item.productId ?? item.id),
    );

  const updateQuantity = (id: string | number, delta: number) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: string | number) => {
    if (!canRemoveItems) return;
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const toggleExtra = (
    itemId: string | number,
    extra: { name: string; price: number },
  ) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== itemId) return item;
        const selected = item.selectedExtras ?? [];
        const exists = selected.some(
          (selectedExtra) =>
            selectedExtra.name.toLowerCase() === extra.name.toLowerCase(),
        );
        if (exists) {
          return {
            ...item,
            unitPrice: item.unitPrice - extra.price,
            selectedExtras: selected.filter(
              (selectedExtra) =>
                selectedExtra.name.toLowerCase() !== extra.name.toLowerCase(),
            ),
          };
        }
        return {
          ...item,
          unitPrice: item.unitPrice + extra.price,
          selectedExtras: [
            ...selected,
            { name: extra.name, price: extra.price },
          ],
        };
      }),
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const deliveryFee = Number(order.deliveryFee || 0);
  const tax = Number(order.tax || 0);
  const discount = Number(order.discount || 0);
  const total = Math.max(subtotal + deliveryFee + tax - discount, 0);

  const editingItem =
    editingItemId === null
      ? null
      : items.find((item) => item.id === editingItemId) ?? null;
  const editingProduct = editingItem ? getProduct(editingItem) ?? null : null;

  const editingLine: CartLineItem | null =
    editingItem && editingProduct
      ? {
          uid: String(editingItem.id),
          productId: editingProduct.id,
          name: editingItem.name,
          basePrice: editingProduct.unitPrice,
          unitPrice: editingItem.unitPrice,
          quantity: editingItem.quantity,
          variantSelections: (editingItem.selectedVariants ?? []).map(
            (variant) => ({
              groupName: variant.group,
              optionName: variant.option,
              price: variant.priceAdjustment,
            }),
          ),
          extras: (editingItem.selectedExtras ?? []).map((extra) => ({
            name: extra.name,
            price: extra.price,
          })),
          specialRequest: editingItem.note,
        }
      : null;

  const handleCustomized = (line: CartLineItem) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              selectedVariants: line.variantSelections.map((variant) => ({
                group: variant.groupName,
                option: variant.optionName,
                priceAdjustment: variant.price,
              })),
              selectedExtras: line.extras.map((extra) => ({
                name: extra.name,
                price: extra.price,
              })),
              note: line.specialRequest,
            }
          : item,
      ),
    );
    setEditingItemId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedOrder: Order = {
      ...order,
      status,
      paymentMethod,
      items,
      subtotal,
      total,
    };

    try {
      await api.put(`/orders/${order.id}`, {
        status: mapOrderStatusToBackend(status),
        paymentMethod,
        items: items.map((item) => ({
          productId: String(item.productId ?? item.id),
          name: item.name,
          quantity: item.quantity,
          price: item.unitPrice,
          notes: item.note || undefined,
          selectedVariants: item.selectedVariants?.map((variant) => ({
            group: variant.group,
            option: variant.option,
            priceAdjustment: variant.priceAdjustment,
          })),
          selectedExtras: item.selectedExtras?.map((extra) => ({
            name: extra.name,
            price: extra.price,
          })),
        })),
      });
      onSaved(updatedOrder);
      showSuccessToast(t("Order updated"));
      onOpenChange(false);
    } catch {
      showErrorToast(t("Failed to update order"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[92vh] w-[696px] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-[696px]"
      >
        {isStatusOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}
        <div className="shrink-0 px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-[#28293D]">
              {t("Edit Order")} #{displayId}
            </DialogTitle>
            <OrdersStatusBadge status={status} />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-medium text-black">
              {t("Status")}
            </label>
            <DropdownSelect
              options={ORDER_STATUSES.map((value) => ({
                label: t(value),
                value,
              }))}
              selected={status}
              onSelect={(value) => setStatus(value as OrderStatus)}
              onOpenChange={setIsStatusOpen}
              placeholder={t("Status")}
              align="start"
              className="md:w-full"
              contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)] border-0"
            />
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-[#CACBD4] bg-[#F7F7F5] px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-tight text-[#595959]">
              {t("PAYMENT METHOD")}
            </p>
            <div className="flex items-stretch gap-6">
              {PAYMENT_METHODS.map(({ value, Icon }) => {
                const selected = paymentMethod === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentMethod(value)}
                    className={
                      selected
                        ? "flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-[5px] bg-[#F5F0EA] px-4 py-8 outline outline-2 -outline-offset-2 outline-primary"
                        : "flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-[5px] bg-[#FAFAF7] px-4 py-8 outline outline-2 -outline-offset-2 outline-[#E5E5E5]"
                    }
                  >
                    <Icon className="size-6 text-black" />
                    <span className="text-lg font-medium leading-5 tracking-tight text-black">
                      {t(value)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {items.length === 0 && (
              <p className="py-6 text-center text-sm text-[#8B8B8B]">
                {t("No items")}
              </p>
            )}

            {items.map((item) => {
              const product = getProduct(item);
              const variantText = (item.selectedVariants ?? [])
                .map((variant) => `${variant.group}: ${variant.option}`)
                .join(" - ");
              const variantAdjustment = (item.selectedVariants ?? []).reduce(
                (sum, variant) => sum + (variant.priceAdjustment || 0),
                0,
              );
              const extraAdjustment = (item.selectedExtras ?? []).reduce(
                (sum, extra) => sum + (extra.price || 0),
                0,
              );
              const baseUnitPrice =
                item.unitPrice - variantAdjustment - extraAdjustment;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-[#F7F7F5] p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate text-xs font-bold leading-3 tracking-tight text-[#28293D]">
                        {item.name}
                      </p>
                      {variantText && (
                        <p className="truncate text-[10px] font-semibold leading-3 tracking-tight text-[#8B8B8B]">
                          {variantText}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`${t("Remove")} ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      disabled={!canRemoveItems}
                      className={
                        canRemoveItems
                          ? "flex size-4 shrink-0 cursor-pointer items-center justify-center"
                          : "flex size-4 shrink-0 cursor-not-allowed items-center justify-center opacity-40"
                      }
                    >
                      <Trash2 className="size-4 text-[#C90000]" />
                    </button>
                  </div>

                  <div className="flex h-9 items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        aria-label={t("Decrease quantity")}
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-[#E5E5E5] bg-white p-1.5"
                      >
                        <Minus className="size-3.5 text-black" />
                      </button>
                      <span className="min-w-4 text-center text-xs font-bold tracking-tight text-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={t("Increase quantity")}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-[#E5E5E5] bg-white p-1.5"
                      >
                        <Plus className="size-3.5 text-black" />
                      </button>
                    </div>
                    <span className="text-xs text-black">
                      <span className="font-medium">EGP</span>{" "}
                      <span className="font-normal">
                        {(baseUnitPrice * item.quantity).toFixed(2)}
                      </span>
                    </span>
                  </div>

                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-[#8F6900] bg-[#F7F7F5] p-3">
                      {item.selectedExtras.map((extra, index) => {
                        const availableExtras = product?.extras ?? [];
                        const row = (
                          <span className="flex w-full items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5">
                              <span className="flex size-5 items-center justify-center rounded-md bg-primary ring-4 ring-[#624F1C1A]">
                                <Check className="size-3.5 text-white" />
                              </span>
                              <span className="text-xs font-medium leading-3 tracking-tight text-[#28293D]">
                                {extra.name}
                              </span>
                            </span>
                            <span className="text-xs text-black">
                              <span className="font-medium">+EGP </span>
                              <span className="font-semibold">
                                {(extra.price || 0).toFixed(2)}
                              </span>
                            </span>
                          </span>
                        );

                        if (availableExtras.length === 0) {
                          return (
                            <div key={`${extra.name}-${index}`}>{row}</div>
                          );
                        }

                        return (
                          <DropdownMenu key={`${extra.name}-${index}`}>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="w-full cursor-pointer text-start"
                              >
                                {row}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              sideOffset={6}
                              className="z-80 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-xl"
                            >
                              {availableExtras.map((option) => {
                                const isSelected = (
                                  item.selectedExtras ?? []
                                ).some(
                                  (selectedExtra) =>
                                    selectedExtra.name.toLowerCase() ===
                                    option.name.toLowerCase(),
                                );
                                return (
                                  <DropdownMenuItem
                                    key={option.id}
                                    onSelect={() =>
                                      toggleExtra(item.id, {
                                        name: option.name,
                                        price: option.price,
                                      })
                                    }
                                    className={cn(
                                      "flex h-10 items-center rounded-xl px-3 text-sm",
                                      isSelected
                                        ? "bg-primary font-semibold text-white focus:bg-primary focus:text-white"
                                        : "font-medium text-[#28293D] focus:bg-[#FAFAF7] focus:text-[#28293D]",
                                    )}
                                  >
                                    {option.name}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      })}
                    </div>
                  )}

                  {product && (
                    <button
                      type="button"
                      onClick={() => setEditingItemId(item.id)}
                      className="flex h-10 cursor-pointer items-center justify-center gap-3 rounded-[5px] text-xs font-semibold leading-4 tracking-tight text-primary"
                    >
                      <SquarePen className="size-4" />
                      {t("Edit")}
                    </button>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between rounded-2xl border border-[#8F6900] bg-[#F5F0EA] px-3 py-6">
              <span className="text-sm font-semibold uppercase leading-4 tracking-tight text-black">
                {t("TOTAL")}
              </span>
              <span className="text-xl leading-6 text-black">
                <span className="font-medium">EGP</span>{" "}
                <span className="font-bold">{total.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#CACBD4] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-14 cursor-pointer rounded-[5px] border border-[#8F6900] px-7 text-base font-semibold text-primary"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 cursor-pointer rounded-[5px] bg-primary px-7 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("Save Changes")}
            </button>
          </div>
        </div>
      </DialogContent>

      <ProductCustomizationModal
        product={editingProduct}
        editingLine={editingLine}
        onClose={() => setEditingItemId(null)}
        onSubmit={handleCustomized}
      />
    </Dialog>
  );
};

export default EditOrderDialog;
