import { useEffect, useRef, useState } from "react";
import { Printer, Wallet } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import OrdersStatusBadge from "./OrdersStatusBadge";
import AdministrativeDiscountDialog from "./AdministrativeDiscountDialog";
import type { Order } from "../types";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { translatePaymentMethod } from "../utils";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { mapOrder } from "../utils/orderMappers";
import { generateKitchenReceiptHtml } from "../utils/kitchenReceipt";
import { generateCustomerReceiptHtml } from "../utils/customerReceipt";

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  /** Fired with the fresh backend order after a mutation (discount, mark-as-paid) so the caller can update its own copy. */
  onOrderUpdated?: (order: Order) => void;
}

const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const OrderDetailsDialog = ({
  open,
  order,
  onOpenChange,
  onOrderUpdated,
}: OrderDetailsDialogProps) => {
  const { t } = useTranslation();
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [adminDiscount, setAdminDiscount] = useState(0);
  const [appliedDiscountType, setAppliedDiscountType] = useState<"fixed" | "percentage" | null>(null);
  const [appliedDiscountValue, setAppliedDiscountValue] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdminDiscount(0);
    setAppliedDiscountType(null);
    setAppliedDiscountValue(null);
  }, [order?.id]);

  if (!order) return null;

  const rawOrder = order as any;
  const backendDiscount = Number(
    order.discount ?? rawOrder.discountAmount ?? rawOrder.discount ?? 0
  );
  const effectiveDiscount = adminDiscount > 0 ? adminDiscount : backendDiscount;

  const effectiveDiscountType: "fixed" | "percentage" =
    appliedDiscountType ||
    order.discountType ||
    rawOrder.discountType ||
    "fixed";

  const effectiveDiscountValue =
    appliedDiscountValue ??
    order.discountValue ??
    rawOrder.discountValue ??
    0;

  const getDiscountDisplayText = () => {
    if (effectiveDiscountType === "percentage") {
      if (effectiveDiscountValue > 0) {
        return `${effectiveDiscountValue}% (${formatCurrency(effectiveDiscount)})`;
      }
      return `${effectiveDiscount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} %`;
    }
    return formatCurrency(effectiveDiscount);
  };

  const displayId = order.orderId || order.id;
  // gross = subtotal + tax, computed the same way the backend computes it —
  // this must be the discount base, not subtotal + deliveryFee, or the
  // preview and the backend's actual result diverge (e.g. on dine-in orders
  // where tax isn't a delivery fee).
  const subtotalVal = Number(order.subtotal || rawOrder.subtotal || 0);
  const deliveryFeeVal = Number(order.deliveryFee || rawOrder.deliveryFee || 0);
  const taxVal = Number(rawOrder.tax || order.tax || 0);
  const orderTotalVal = Number(order.total || rawOrder.total || 0);

  const baseTotal = orderTotalVal > 0 ? orderTotalVal : subtotalVal + deliveryFeeVal + taxVal;
  const finalTotal = adminDiscount > 0
    ? Math.max(subtotalVal + deliveryFeeVal + taxVal - adminDiscount, 0)
    : Math.max(baseTotal, 0);
  const zoneName =
    order.zone ||
    (typeof rawOrder.customer?.region === "object"
      ? rawOrder.customer?.region?.name
      : rawOrder.customer?.region) ||
    (typeof rawOrder.customer?.zone === "object"
      ? rawOrder.customer?.zone?.name
      : rawOrder.customer?.zone) ||
    (typeof rawOrder.region === "object"
      ? rawOrder.region?.name
      : rawOrder.region) ||
    "";

  // Derive order type label from type ("dine_in" | "takeaway" | "delivery") or address content
  const rawType = (order.type || rawOrder.type || "").toLowerCase();
  const rawAddr = rawOrder.customer?.address || order.address || "";

  const isDineIn = rawType === "dine_in" || rawAddr.toLowerCase().includes("table");
  const isTakeaway = rawType === "takeaway" || rawAddr.toLowerCase() === "takeaway";
  const isDelivery = rawType === "delivery" || (!isDineIn && !isTakeaway && !!rawAddr && rawAddr !== "In Store" && rawAddr !== "Takeaway");

  const tableOrAddressText = isDineIn
    ? (rawAddr && rawAddr !== "In Store" && rawAddr !== "Takeaway" ? rawAddr : "")
    : isDelivery
      ? rawAddr
      : "";

  const orderTypeLabel = isDineIn
    ? (tableOrAddressText ? `طاولة: ${tableOrAddressText}` : "صالة")
    : isTakeaway
      ? "تيك أواي"
      : isDelivery
        ? "توصيل"
        : "صالة";

  const orderTypeDisplayUi = isDineIn
    ? `Dine-In ${tableOrAddressText ? `(${tableOrAddressText})` : ""}`
    : isTakeaway
      ? "Takeaway"
      : isDelivery
        ? `Delivery ${tableOrAddressText ? `(${tableOrAddressText})` : ""}`
        : "Dine-In";

  const handleMarkAsPaid = async () => {
    try {
      const response = await api.patch(`/orders/${order.id}/payment-status`, {
        paymentStatus: "paid",
      });
      if (response.data?.order) onOrderUpdated?.(mapOrder(response.data.order));
      showSuccessToast(t("Order marked as paid"));
    } catch {
      showErrorToast(t("Failed to update payment status"));
    }
  };

  const handleApplyDiscount = async (
    discountType: "fixed" | "percentage",
    discountValue: number,
    password: string,
    reason: string
  ) => {
    try {
      const response = await api.patch(`/orders/${order.id}/discount`, {
        discountType,
        discountValue,
        password,
        reason,
      });
      // Reflect the backend's actual resolved amount/total, not a locally
      // guessed one — this is what was showing a stale/unchanged total before.
      setAdminDiscount(response.data?.discountAmount ?? 0);
      setAppliedDiscountType(discountType);
      setAppliedDiscountValue(discountValue);
      if (response.data?.order) onOrderUpdated?.(mapOrder(response.data.order));
      showSuccessToast(t("Discount applied successfully"));
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      showErrorToast(serverMessage || t("Failed to save discount"));
    }
  };

  const handlePrint = (type: "customer" | "kitchen") => {
    const now = new Date();
    const printTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const printDate = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });

    const kitchenReceiptHtml = generateKitchenReceiptHtml({
      orderNumber: String(displayId),
      orderType: isDineIn ? "dine-in" : isTakeaway ? "takeaway" : isDelivery ? "delivery" : "dine-in",
      tableNumber: tableOrAddressText,
      customerName: order.customerName,
      date: order.date || printDate,
      time: order.time || printTime,
      brandName: "Patria Restaurant",
      notes: (order as any).notes || (order as any).note || undefined,
      items: order.items.map((item) => {
        const rawItem = item as any;
        return {
          name: item.name,
          qty: item.quantity,
          options: item.selectedVariants?.map((v) => `${v.group}: ${v.option}`) || [],
          extras: item.selectedExtras?.map((e) => `+ ${e.name}`) || [],
          excluded: rawItem.excludedIngredients || rawItem.excluded_ingredients || [],
          note: item.note || undefined,
        };
      }),
    });

    const customerReceiptHtml = generateCustomerReceiptHtml({
      orderNumber: String(displayId),
      date: order.date || printDate,
      time: order.time || printTime,
      orderType: isDineIn ? "dine-in" : isTakeaway ? "takeaway" : isDelivery ? "delivery" : "dine-in",
      tableNumber: tableOrAddressText,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      paymentMethod: order.paymentMethod,
      status: order.paymentState || "paid",
      subtotal: order.subtotal,
      discount: effectiveDiscount,
      discountName: effectiveDiscount > 0 ? getDiscountDisplayText() : undefined,
      deliveryFee: order.deliveryFee,
      total: finalTotal,
      items: order.items.map((item) => {
        const rawItem = item as any;
        return {
          name: item.name,
          qty: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          options: item.selectedVariants?.map((v) => `${v.group}: ${v.option}`) || [],
          extras: item.selectedExtras?.map((e) => `+ ${e.name}${(e.price || 0) > 0 ? ` (${(e.price || 0).toFixed(2)} EGP)` : ""}`) || [],
          excluded: rawItem.excludedIngredients || rawItem.excluded_ingredients || [],
          note: item.note || undefined,
        };
      }),
    });

    const receiptHtml = type === "kitchen" ? kitchenReceiptHtml : customerReceiptHtml;

    const win = window.open("", "_blank", "width=400,height=600");
    if (win) {
      win.document.write(receiptHtml);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 250);
    }
  };

  const rawSource = String(order.source || rawOrder.source || "").toLowerCase();
  const isPosOrder =
    rawSource === "pos" ||
    (rawType !== "delivery" &&
      rawType !== "app" &&
      rawType !== "application" &&
      rawType !== "call" &&
      rawSource !== "app" &&
      rawSource !== "application" &&
      rawSource !== "call" &&
      rawSource !== "call_center");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="max-h-[92vh] h-[92vh] w-[696px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl ring-0 flex flex-col sm:max-w-[696px]"
      >
        <div ref={printRef} className="flex h-full min-h-0 flex-col gap-5">
          {/* Header (shrink-0) */}
          <div className="shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-[#333333]">
                {t("Order")} #{displayId}
              </DialogTitle>
              <OrdersStatusBadge status={order.status} />
            </div>
          </div>

          {/* Body (scrollable flex-1) */}
          <div className="min-h-0 flex-1 overflow-y-auto space-y-6 pe-2">
            {/* Customer details · address/order type · zone card */}
            <section className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.20px] text-[#595959]">
                  {t("CUSTOMER DETAILS")}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.20px] text-[#595959]">
                  {t("DATE")}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[16px] font-semibold leading-[17.12px] tracking-[0.32px] text-[#333333]">
                    {order.customerName}
                  </p>
                  {order.customerPhone && (
                    <p className="text-[12px] font-normal leading-[16.80px] tracking-[0.24px] text-[#8B8B8B]" dir="ltr">
                      {order.customerPhone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 text-right">
                  <p className="text-[12px] font-medium tracking-[0.24px] text-[#28293D]">
                    {order.date}
                  </p>
                  <p className="text-[12px] font-normal tracking-[0.24px] text-[#595959]">
                    {order.time}
                  </p>
                  {order.paymentState !== "None" && (
                    <div className="mt-1 flex justify-end">
                      {order.paymentState === "Paid" ? (
                        <span className="inline-flex items-center rounded-full border border-[#00A86B] bg-[#E2F4ED] px-2.5 py-0.5 text-[13px] font-semibold tracking-[0.26px] text-[#00A86B]">
                          {t("Paid")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleMarkAsPaid}
                          className="inline-flex cursor-pointer items-center rounded-full border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-0.5 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]"
                          title={t("Mark as Paid")}
                        >
                          {t("Pending")} · {t("Mark as Paid")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full border-t border-[#CACBD4]" />

              {/* Address (for Application & Call orders) vs Order Type (for POS orders) */}
              {!isPosOrder ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.24px] text-[#8B8B8B]">
                    {t("ADDRESS")}:
                  </span>
                  <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                    {tableOrAddressText || rawAddr || t("No address specified")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.24px] text-[#8B8B8B]">
                    {t("ORDER TYPE")}:
                  </span>
                  <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                    {orderTypeDisplayUi}
                  </span>
                </div>
              )}

              {/* Zone & Delivery Fees (Application & Call orders) */}
              {!isPosOrder && (zoneName || order.deliveryFee >= 0) && (
                <>
                  <div className="w-full border-t border-[#CACBD4]" />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.24px] text-[#8B8B8B]">
                        {t("ZONE")}
                      </span>
                      <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                        {zoneName || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.24px] text-[#8B8B8B]">
                        {t("DELIVERY FEES")}
                      </span>
                      <span className="text-[13px] font-semibold tracking-[0.26px] text-[#333333]">
                        {formatCurrency(order.deliveryFee)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Orders list card */}
            <section className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.20px] text-[#595959]">
                {t("ORDERS")}
              </p>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => {
                  const variantTotalAdjustment =
                    item.selectedVariants?.reduce(
                      (sum, v) => sum + (v.priceAdjustment || 0),
                      0
                    ) || 0;
                  const extraTotalAdjustment =
                    item.selectedExtras?.reduce(
                      (sum, e) => sum + (e.price || 0),
                      0
                    ) || 0;
                  const baseUnitPrice =
                    item.unitPrice - variantTotalAdjustment - extraTotalAdjustment;
                  const displayBasePrice = item.quantity * baseUnitPrice;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-[12px] border border-[#E5E5E5] bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[16px] text-black">
                          <span className="font-medium">{item.quantity}X </span>
                          <span className="font-normal">{item.name}</span>
                        </p>
                        <span className="shrink-0 text-[13px] font-semibold tracking-[0.26px] text-[#28293D]">
                          {formatCurrency(displayBasePrice)}
                        </span>
                      </div>

                      {item.selectedVariants && item.selectedVariants.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {item.selectedVariants.map((v, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="inline-flex items-center rounded-full border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]">
                                {v.group}: {v.option}
                              </span>
                              {(v.priceAdjustment || 0) > 0 && (
                                <span className="shrink-0 text-[13px] font-semibold tracking-[0.26px] text-[#28293D]">
                                  +{formatCurrency(item.quantity * (v.priceAdjustment || 0))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {item.selectedExtras.map((e, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="inline-flex items-center rounded-full border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]">
                                Extra: {e.name}
                              </span>
                              {(e.price || 0) > 0 && (
                                <span className="shrink-0 text-[13px] font-semibold tracking-[0.26px] text-[#28293D]">
                                  +{formatCurrency(item.quantity * (e.price || 0))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.note && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center rounded-full border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]">
                            Notes: {item.note}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Payment & Totals summary card */}
            <section className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4">
              <div className="flex flex-col gap-4.5 text-[16px]">
                <div className="flex items-center justify-between text-[#23252A]">
                  <span className="font-medium leading-[17.60px]">{t("Subtotal")}:</span>
                  <span className="font-semibold tracking-[0.32px] text-[#333333]">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                {order.deliveryFee > 0 && (
                  <div className="flex items-center justify-between text-[#23252A]">
                    <span className="font-medium leading-[17.60px]">{t("Delivery Fees")}:</span>
                    <span className="font-semibold tracking-[0.32px] text-[#333333]">
                      {formatCurrency(order.deliveryFee)}
                    </span>
                  </div>
                )}

                {effectiveDiscount > 0 && (
                  <div className="flex items-center justify-between text-[#059B5A]">
                    <span className="font-medium leading-[17.60px]">{t("Discount")}:</span>
                    <span className="font-semibold tracking-[0.32px]">
                      {getDiscountDisplayText()}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full border-t border-[#CACBD4]" />

              <div className="flex items-center justify-between">
                <span className="text-[18px] font-semibold leading-[19.80px] text-black">
                  {t("Total")}:
                </span>
                <span className="text-[18px] font-semibold tracking-[0.36px] text-black">
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center rounded-full border border-[#004EF9] bg-[#EDF4FB] px-3 py-1.5 text-[13px] font-semibold tracking-[0.26px] text-[#3574FF]">
                  {translatePaymentMethod(order.paymentMethod, t)}
                </span>
              </div>
            </section>
          </div>

          {/* Action buttons footer (shrink-0) */}
          <div className="shrink-0 flex flex-col gap-4 border-t border-[#CACBD4] pt-4 bg-white">
            <button
              type="button"
              onClick={() => setIsDiscountOpen(true)}
              className="flex h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900]"
            >
              <Wallet className="size-[18px] text-[#8F6900]" />
              {t("Administrative discount application")}
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handlePrint("customer")}
                className="flex h-[56px] flex-1 cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900]"
              >
                <Printer className="size-[18px] text-[#8F6900]" />
                {t("Print Customer Receipt")}
              </button>
              <button
                type="button"
                onClick={() => handlePrint("kitchen")}
                className="flex h-[56px] flex-1 cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white"
              >
                <Printer className="size-[18px] text-white" />
                {t("Print Kitchen Receipt")}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>

      <AdministrativeDiscountDialog
        open={isDiscountOpen}
        total={baseTotal}
        onOpenChange={setIsDiscountOpen}
        onApply={handleApplyDiscount}
      />
    </Dialog>
  );
};

export default OrderDetailsDialog;
