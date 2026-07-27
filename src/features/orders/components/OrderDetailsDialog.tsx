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

  const displayId = order.orderId || order.id;
  const grossTotal = order.total;
  const finalTotal = Math.max(grossTotal - adminDiscount, 0);

  const rawOrder = order as any;
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

  const handleApplyDiscount = async (discount: number, reason: string) => {
    setAdminDiscount(discount);
    try {
      await api.patch(`/orders/${order.id}/discount`, {
        discountAmount: discount,
        reason,
      });
      showSuccessToast(t("Discount applied successfully"));
    } catch {
      showErrorToast(t("Failed to save discount"));
    }
  };

  const handlePrint = (type: "customer" | "kitchen") => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>${type === "kitchen" ? "Kitchen Receipt" : "Customer Receipt"}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: monospace; font-size: 12px; width: 80mm; padding: 8px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .row { display: flex; justify-content: space-between; margin: 3px 0; }
          .title { font-size: 16px; font-weight: bold; }
          .total { font-size: 14px; font-weight: bold; }
          ${type === "kitchen" ? ".customer-info { display: none; }" : ""}
        </style>
      </head>
      <body>
        <div class="center">
          <div class="title">Patria Restaurant</div>
          <div>مطعم باتريا</div>
        </div>
        <div class="divider"></div>
        <div class="row"><span>طلب #</span><span>${displayId}</span></div>
        <div class="row"><span>نوع الطلب:</span><span>${order.address || "محل"}</span></div>
        <div class="row customer-info"><span>العميل:</span><span>${order.customerName}</span></div>
        <div class="divider"></div>
        ${order.items.map(item => {
          const variantTotalAdjustment = item.selectedVariants?.reduce((sum, v) => sum + (v.priceAdjustment || 0), 0) || 0;
          const extraTotalAdjustment = item.selectedExtras?.reduce((sum, e) => sum + (e.price || 0), 0) || 0;
          const baseUnitPrice = item.unitPrice - variantTotalAdjustment - extraTotalAdjustment;
          const displayBasePrice = item.quantity * baseUnitPrice;

          return `
            <div class="row">
              <span>${item.name} × ${item.quantity}</span>
              <span>${formatCurrency(displayBasePrice)}</span>
            </div>
            ${item.selectedVariants && item.selectedVariants.length > 0 ?
              item.selectedVariants.map(v => `
                <div class="row" style="font-size: 10px; color: #555; padding-right: 8px; margin: 2px 0;">
                  <span>- ${v.group}: ${v.option}</span>
                  ${(v.priceAdjustment || 0) > 0 ? `<span>+${formatCurrency(item.quantity * (v.priceAdjustment || 0))}</span>` : "<span></span>"}
                </div>
              `).join("")
              : ""
            }
            ${item.selectedExtras && item.selectedExtras.length > 0 ?
              item.selectedExtras.map(e => `
                <div class="row" style="font-size: 10px; color: #555; padding-right: 8px; margin: 2px 0;">
                  <span>- Extra: ${e.name}</span>
                  ${(e.price || 0) > 0 ? `<span>+${formatCurrency(item.quantity * (e.price || 0))}</span>` : "<span></span>"}
                </div>
              `).join("")
              : ""
            }
          `;
        }).join("")}
        <div class="divider"></div>
        <div class="row"><span>المجموع الفرعي:</span><span>${formatCurrency(order.subtotal)}</span></div>
        ${order.deliveryFee > 0 ? `<div class="row"><span>رسوم التوصيل:</span><span>${formatCurrency(order.deliveryFee)}</span></div>` : ""}
        ${adminDiscount > 0 ? `<div class="row"><span>الخصم:</span><span>-${formatCurrency(adminDiscount)}</span></div>` : ""}
        <div class="divider"></div>
        <div class="row total"><span>الإجمالي:</span><span>${formatCurrency(finalTotal)}</span></div>
        <div class="divider"></div>
        <div class="center" style="margin-top:8px">شكراً لزيارتكم</div>
      </body>
      </html>
    `;

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

              {/* Address */}
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-[13px] text-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#595959]">
                    {t("Address")}:{" "}
                  </span>
                  {t(order.address)}
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
                {adminDiscount > 0 && (
                  <div className="flex items-center justify-between text-[#059B5A]">
                    <span>{t("Discount")}:</span>
                    <span>-{formatCurrency(adminDiscount)}</span>
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
        total={grossTotal}
        onOpenChange={setIsDiscountOpen}
        onApply={handleApplyDiscount}
      />
    </Dialog>
  );
};

export default OrderDetailsDialog;
