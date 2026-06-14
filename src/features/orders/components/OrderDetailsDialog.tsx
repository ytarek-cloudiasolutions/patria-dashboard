import { useEffect, useState } from "react";
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

  useEffect(() => {
    setAdminDiscount(0);
  }, [order?.id]);

  if (!order) return null;

  const grossTotal = order.total + order.deliveryFee;
  const finalTotal = Math.max(grossTotal - adminDiscount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[8px] bg-white p-0 ring-0 sm:max-w-140 lg:max-w-174"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header (fixed) */}
          <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:gap-3 sm:px-6 sm:pt-6">
            <DialogTitle className="text-[20px] font-semibold text-[#333333] sm:text-[24px]">
              {t("Order")} #{order.id.split("-").at(-1)}
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
                  <div className="mt-2 flex justify-end">
                    <OrdersStatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-[#E5E5E5]" />

              {/* Address */}
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-[13px] text-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#595959]">
                    {t("Address")}:{" "}
                  </span>
                  {order.address}
                </p>
              </div>

              {(order.zone || order.deliveryFee > 0) && (
                <>
                  <Separator className="my-4 bg-[#E5E5E5]" />
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-[#595959]">
                        {t("Zone")}
                      </p>
                      <p className="text-[13px] text-[#333333]">
                        {order.zone ?? "-"}
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
                {order.items.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex min-h-10 items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-white px-3 gap-3"
                  >
                    <span className="truncate text-[13px] font-medium text-[#333333] sm:text-[14px]">
                      {item.quantity}X {item.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-[#28293D]">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                ))}
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
                }}
              />
              <DefaultButton
                data={{
                  buttonText: t("Print Kitchen Receipt"),
                  type: "button",
                  icon: <Printer className="size-4" />,
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
        onApply={(discount) => setAdminDiscount(discount)}
      />
    </Dialog>
  );
};

export default OrderDetailsDialog;
