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

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
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
}: OrderDetailsDialogProps) => {
  const { t } = useTranslation();
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [adminDiscount, setAdminDiscount] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdminDiscount(0);
  }, [order?.id]);

  if (!order) return null;

  const rawOrder = order as any;
  const backendDiscount = Number(
    order.discount ?? rawOrder.discountAmount ?? rawOrder.discount ?? 0
  );
  const effectiveDiscount = adminDiscount > 0 ? adminDiscount : backendDiscount;

  const displayId = order.orderId || order.id;
  const subtotal = order.subtotal || 0;
  const deliveryFee = order.deliveryFee || 0;
  const baseBeforeDiscount =
    subtotal > 0
      ? subtotal + deliveryFee
      : (order.total || 0) + backendDiscount;
  const finalTotal = Math.max(baseBeforeDiscount - effectiveDiscount, 0);
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
      await api.patch(`/orders/${order.id}/payment-status`, {
        paymentStatus: "paid",
      });
      showSuccessToast(t("Order marked as paid"));
    } catch {
      showErrorToast(t("Failed to update payment status"));
    }
  };

  const handleApplyDiscount = async (
    discount: number,
    password: string,
    reason: string
  ) => {
    setAdminDiscount(discount);
    try {
      await api.patch(`/orders/${order.id}/discount`, {
        discountAmount: discount,
        password,
        reason,
      });
      showSuccessToast(t("Discount applied successfully"));
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      showErrorToast(serverMessage || t("Failed to save discount"));
    }
  };

  const handlePrint = (type: "customer" | "kitchen") => {
    const now = new Date();
    const printTime = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    const printDate = now.toLocaleDateString("ar-EG");

    const kitchenReceiptHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>Kitchen Receipt - طلب #${displayId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: monospace; font-size: 13px; width: 80mm; padding: 10px; }
          .center { text-align: center; }
          .divider { border-top: 2px dashed #000; margin: 8px 0; }
          .divider-thin { border-top: 1px dashed #000; margin: 5px 0; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          .header-title { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
          .kitchen-label { font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
          .order-num { font-size: 22px; font-weight: bold; text-align: center; margin: 6px 0; }
          .order-type { font-size: 15px; font-weight: bold; text-align: center; border: 2px solid #000; padding: 4px 8px; display: inline-block; margin: 4px auto; }
          .order-type-wrap { text-align: center; margin: 4px 0; }
          .item-name { font-size: 14px; font-weight: bold; }
          .item-qty { font-size: 18px; font-weight: bold; }
          .modifier { font-size: 11px; padding-right: 10px; margin: 2px 0; }
          .note { font-size: 11px; padding-right: 10px; margin: 2px 0; font-style: italic; border-right: 2px solid #000; }
          .customer-name { font-size: 13px; font-weight: bold; }
          .meta { font-size: 11px; color: #333; }
        </style>
      </head>
      <body>
        <div class="center">
          <div class="header-title">Patria Restaurant</div>
          <div class="kitchen-label">*** KITCHEN COPY ***</div>
        </div>
        <div class="divider"></div>

        <div class="order-num"># ${displayId}</div>

        <div class="order-type-wrap">
          <span class="order-type">${orderTypeLabel}</span>
        </div>

        <div class="divider-thin"></div>
        <div class="row">
          <span class="meta">العميل:</span>
          <span class="customer-name">${order.customerName}</span>
        </div>
        <div class="row">
          <span class="meta">التاريخ:</span>
          <span class="meta">${order.date || printDate} ${order.time || printTime}</span>
        </div>
        <div class="divider"></div>

        ${order.items.map((item, index) => `
          <div style="margin: 6px 0;">
            <div class="row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">× ${item.quantity}</span>
            </div>
            ${item.selectedVariants && item.selectedVariants.length > 0
              ? item.selectedVariants.map(v => `
                  <div class="modifier">▸ ${v.group}: ${v.option}</div>
                `).join("")
              : ""
            }
            ${item.selectedExtras && item.selectedExtras.length > 0
              ? item.selectedExtras.map(e => `
                  <div class="modifier">+ إضافة: ${e.name}</div>
                `).join("")
              : ""
            }
            ${item.note ? `<div class="note">ملاحظة: ${item.note}</div>` : ""}
          </div>
          ${index < order.items.length - 1 ? '<div class="divider-thin"></div>' : ""}
        `).join("")}

        <div class="divider"></div>
        <div class="center" style="font-size: 11px; margin-top: 4px;">
          وقت الطباعة: ${printTime}
        </div>
      </body>
      </html>
    `;

    const customerReceiptHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>Customer Receipt - طلب #${displayId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 10px; color: #000; }
          .center { text-align: center; }
          .left { text-align: left; }
          .right { text-align: right; }
          .divider { border-top: 1px dashed #000; margin: 7px 0; }
          .divider-solid { border-top: 1px solid #000; margin: 7px 0; }
          .row { display: flex; justify-content: space-between; align-items: baseline; margin: 3px 0; }
          .restaurant-name { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
          .restaurant-ar { font-size: 13px; margin-top: 2px; }
          .receipt-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; color: #555; }
          .order-num { font-size: 13px; font-weight: bold; }
          .section-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #555; margin-bottom: 3px; }
          .item-name { font-size: 12px; font-weight: bold; flex: 1; }
          .item-price { font-size: 12px; font-weight: bold; white-space: nowrap; }
          .item-unit { font-size: 10px; color: #555; padding-right: 10px; margin: 1px 0; }
          .modifier { font-size: 10px; color: #555; padding-right: 10px; margin: 1px 0; }
          .total-row { font-size: 14px; font-weight: bold; }
          .payment-badge { display: inline-block; border: 1px solid #000; padding: 2px 8px; font-size: 11px; font-weight: bold; margin-top: 4px; }
          .thank-you { font-size: 12px; font-weight: bold; margin-top: 4px; }
          .footer-note { font-size: 10px; color: #555; margin-top: 2px; }
        </style>
      </head>
      <body>
        <!-- Header / Branding -->
        <div class="center">
          <div class="restaurant-name">Patria Restaurant</div>
          <div class="restaurant-ar">مطعم باتريا</div>
          <div class="receipt-label">*** فاتورة العميل ***</div>
        </div>

        <div class="divider-solid"></div>

        <!-- Order Info -->
        <div class="row">
          <span class="order-num">طلب # ${displayId}</span>
          <span style="font-size:11px">${order.date || ""} ${order.time || ""}</span>
        </div>
        <div class="row">
          <span style="font-size:11px">نوع الطلب:</span>
          <span style="font-size:11px; font-weight:bold">${orderTypeLabel}</span>
        </div>

        <div class="divider"></div>

        <!-- Customer Info -->
        <div class="section-label">بيانات العميل</div>
        <div class="row">
          <span style="font-size:11px">الاسم:</span>
          <span style="font-size:11px; font-weight:bold">${order.customerName}</span>
        </div>
        ${order.customerPhone ? `
        <div class="row">
          <span style="font-size:11px">الهاتف:</span>
          <span style="font-size:11px" dir="ltr">${order.customerPhone}</span>
        </div>` : ""}
        ${isDelivery && tableOrAddressText ? `
        <div style="margin-top:3px">
          <span style="font-size:10px; font-weight:bold; text-transform:uppercase; color:#555;">العنوان: </span>
          <span style="font-size:11px">${tableOrAddressText}</span>
        </div>` : ""}

        <div class="divider"></div>

        <!-- Items -->
        <div class="section-label">الطلبات</div>
        ${order.items.map(item => {
          const variantTotalAdjustment = item.selectedVariants?.reduce((sum, v) => sum + (v.priceAdjustment || 0), 0) || 0;
          const extraTotalAdjustment = item.selectedExtras?.reduce((sum, e) => sum + (e.price || 0), 0) || 0;
          const baseUnitPrice = item.unitPrice - variantTotalAdjustment - extraTotalAdjustment;
          const displayBasePrice = item.quantity * baseUnitPrice;

          return `
            <div style="margin: 5px 0;">
              <div class="row">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formatCurrency(displayBasePrice)}</span>
              </div>
              <div class="item-unit">${item.quantity} × ${formatCurrency(baseUnitPrice)}</div>
              ${item.selectedVariants && item.selectedVariants.length > 0
                ? item.selectedVariants.map(v => `
                    <div class="row modifier">
                      <span>▸ ${v.group}: ${v.option}</span>
                      ${(v.priceAdjustment || 0) > 0 ? `<span>+${formatCurrency(item.quantity * (v.priceAdjustment || 0))}</span>` : ""}
                    </div>
                  `).join("")
                : ""
              }
              ${item.selectedExtras && item.selectedExtras.length > 0
                ? item.selectedExtras.map(e => `
                    <div class="row modifier">
                      <span>+ إضافة: ${e.name}</span>
                      ${(e.price || 0) > 0 ? `<span>+${formatCurrency(item.quantity * (e.price || 0))}</span>` : ""}
                    </div>
                  `).join("")
                : ""
              }
            </div>
          `;
        }).join("")}

        <div class="divider"></div>

        <!-- Totals -->
        <div class="row">
          <span>المجموع الفرعي:</span>
          <span>${formatCurrency(order.subtotal)}</span>
        </div>
        ${order.deliveryFee > 0 ? `
        <div class="row">
          <span>رسوم التوصيل:</span>
          <span>${formatCurrency(order.deliveryFee)}</span>
        </div>` : ""}
        ${effectiveDiscount > 0 ? `
        <div class="row" style="font-weight:bold">
          <span>الخصم:</span>
          <span>- ${effectiveDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>` : ""}
        <div class="divider-solid"></div>
        <div class="row total-row">
          <span>الإجمالي:</span>
          <span>${formatCurrency(finalTotal)}</span>
        </div>

        <div class="divider"></div>

        <!-- Payment -->
        <div class="row" style="margin-top:2px">
          <span style="font-size:11px">طريقة الدفع:</span>
          <span class="payment-badge">${translatePaymentMethod(order.paymentMethod, t)}</span>
        </div>

        <div class="divider-solid"></div>

        <!-- Footer -->
        <div class="center">
          <div class="thank-you">شكراً لزيارتكم 🙏</div>
          <div class="footer-note">نتطلع لخدمتكم مجدداً</div>
        </div>
      </body>
      </html>
    `;

    const receiptHtml = type === "kitchen" ? kitchenReceiptHtml : customerReceiptHtml;

    const win = window.open("", "_blank", "width=400,height=600");
    if (win) {
      win.document.write(receiptHtml);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 250);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[8px] bg-white p-0 ring-0 sm:max-w-140 lg:max-w-174"
      >
        <div ref={printRef} className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header (fixed) */}
          <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:gap-3 sm:px-6 sm:pt-6">
            <DialogTitle className="text-[20px] font-semibold text-[#333333] sm:text-[24px]">
              {t("Order")} #{displayId}
            </DialogTitle>
            <OrdersStatusBadge status={order.status} />
          </div>

          {/* Body (scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            {/* Customer details · address · zone — single combined card */}
            <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-3 sm:p-4">
              <div className="mb-5 flex items-start justify-between sm:mb-6">
                <p className="text-[10px] font-bold uppercase text-[#595959]">
                  {t("Customer Details")}
                </p>
                <p className="text-[10px] font-bold uppercase text-[#595959]">
                  {t("Date")}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#333333] sm:text-[15px]">
                    {order.customerName}
                  </p>
                  <p className="mt-1 text-[12px] text-[#8B8B8B]" dir="ltr">
                    {order.customerPhone}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-medium text-[#28293D]">
                    {order.date}
                  </p>
                  <p className="mt-1 text-[12px] text-[#8B8B8B]">
                    {order.time}
                  </p>
                  {order.paymentState !== "None" && (
                    <div className="mt-2 flex justify-end">
                      {order.paymentState === "Paid" ? (
                        <span className="inline-flex h-5 items-center justify-center rounded-full border border-[#00A86B] bg-[#E2F4ED] px-2 text-[10px] font-semibold text-[#00A86B]">
                          {t("Paid")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleMarkAsPaid}
                          className="inline-flex h-5 cursor-pointer items-center justify-center rounded-full border border-[#C7861E] bg-[#FFF7E6] px-2 text-[10px] font-semibold text-[#C7861E] transition-colors hover:border-primary hover:bg-primary hover:text-white"
                          title={t("Mark as Paid")}
                        >
                          {t("Pending")} · {t("Mark as Paid")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4 bg-[#E5E5E5]" />

              {/* Order Type / Address */}
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-[13px] text-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#595959]">
                    {t("Order Type")}:{" "}
                  </span>
                  <span className="font-semibold">{orderTypeDisplayUi}</span>
                </p>
              </div>

              {(zoneName || order.deliveryFee > 0) && (
                <>
                  <Separator className="my-4 bg-[#E5E5E5]" />
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-[#595959]">
                        {t("Zone")}
                      </p>
                      <p className="text-[13px] text-[#333333]">
                        {zoneName || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-[10px] font-bold uppercase text-[#595959]">
                        {t("Delivery Fees")}
                      </p>
                      <p className="text-[13px] font-semibold text-[#333333]">
                        {formatCurrency(order.deliveryFee)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="mt-4 rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-3 sm:mt-5 sm:p-4">
              <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
                {t("Orders")}
              </p>
              <div className="space-y-2.5 sm:space-y-3">
                {order.items.map((item) => {
                  const variantTotalAdjustment = item.selectedVariants?.reduce((sum, v) => sum + (v.priceAdjustment || 0), 0) || 0;
                  const extraTotalAdjustment = item.selectedExtras?.reduce((sum, e) => sum + (e.price || 0), 0) || 0;
                  const baseUnitPrice = item.unitPrice - variantTotalAdjustment - extraTotalAdjustment;
                  const displayBasePrice = item.quantity * baseUnitPrice;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-2.5 gap-2"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <p className="truncate text-[13px] font-medium text-[#333333] sm:text-[14px]">
                          {item.quantity}X {item.name}
                        </p>
                        <span className="shrink-0 text-[12px] font-semibold text-[#28293D]">
                          {formatCurrency(displayBasePrice)}
                        </span>
                      </div>

                      {item.selectedVariants && item.selectedVariants.length > 0 && (
                        <div className="space-y-1.5 w-full">
                          {item.selectedVariants.map((v, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 w-full">
                              <span className="inline-flex h-5 items-center rounded-full border border-[#C7861E]/30 bg-[#FFF7E6] px-2 text-[10px] font-semibold text-[#C7861E]">
                                {v.group}: {v.option}
                              </span>
                              {(v.priceAdjustment || 0) > 0 && (
                                <span className="shrink-0 text-[12px] font-semibold text-[#28293D]">
                                  +{formatCurrency(item.quantity * (v.priceAdjustment || 0))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <div className="space-y-1.5 w-full">
                          {item.selectedExtras.map((e, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 w-full">
                              <span className="inline-flex h-5 items-center rounded-full border border-[#C7861E]/30 bg-[#FFF7E6] px-2 text-[10px] font-semibold text-[#C7861E]">
                                {t("Extra")}: {e.name}
                              </span>
                              {(e.price || 0) > 0 && (
                                <span className="shrink-0 text-[12px] font-semibold text-[#28293D]">
                                  +{formatCurrency(item.quantity * (e.price || 0))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.note && (
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span className="inline-flex h-5 items-center rounded-full border border-[#C7861E]/30 bg-[#FFF7E6] px-2 text-[10px] font-semibold text-[#C7861E]">
                            {t("Notes")}: {item.note}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-4 rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-3 sm:mt-5 sm:p-4">
              <div className="space-y-3 text-[13px] sm:space-y-4 sm:text-[14px]">
                <div className="flex items-center justify-between text-[#333333]">
                  <span>{t("Subtotal")}:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[#333333]">
                  <span>{t("Delivery Fees")}:</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                {effectiveDiscount > 0 && (
                  <div className="flex items-center justify-between text-[#059B5A]">
                    <span>{t("Discount")}:</span>
                    <span>
                      -
                      {effectiveDiscount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <Separator className="bg-[#D9D9D9]" />
                <div className="flex items-center justify-between text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                  <span>{t("Total")}:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
                <span className="inline-flex h-6 items-center rounded-full border border-[#3574FF] bg-[#EDF4FB] px-3 text-[12px] font-semibold text-[#3574FF]">
                  {translatePaymentMethod(order.paymentMethod, t)}
                </span>
              </div>
            </section>
          </div>

          {/* Footer (fixed) */}
          <div className="bg-white px-4 pb-4 sm:px-6 sm:pb-6">
            <Separator className="mb-4 bg-[#D9D9D9] sm:mb-5" />

            <button
              type="button"
              onClick={() => setIsDiscountOpen(true)}
              className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-primary bg-white py-3 text-[14px] font-semibold text-primary transition-colors hover:bg-[#F5F0EA] sm:mb-4"
            >
              <Wallet className="size-4" />
              {t("Administrative discount application")}
            </button>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              <DefaultButton
                data={{
                  buttonText: t("Print Customer Receipt"),
                  variant: "outline",
                  type: "button",
                  icon: <Printer className="size-4" />,
                  className:
                    "border-primary bg-white text-primary hover:bg-white hover:text-primary",
                  onClick: () => handlePrint("customer"),
                }}
              />
              <DefaultButton
                data={{
                  buttonText: t("Print Kitchen Receipt"),
                  type: "button",
                  icon: <Printer className="size-4" />,
                  onClick: () => handlePrint("kitchen"),
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>

      <AdministrativeDiscountDialog
        open={isDiscountOpen}
        total={baseBeforeDiscount}
        onOpenChange={setIsDiscountOpen}
        onApply={handleApplyDiscount}
      />
    </Dialog>
  );
};

export default OrderDetailsDialog;
