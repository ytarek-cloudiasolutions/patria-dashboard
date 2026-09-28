import { Printer } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartItem, CartTotals, OrderType } from "../types";
import { formatEgp, lineTotal } from "../utils";
import { generateCustomerReceiptHtml } from "@/features/orders/utils/customerReceipt";

type ReceiptDialogProps = {
  open: boolean;
  orderNumber: string;
  orderType: OrderType;
  table: string;
  items: CartItem[];
  totals: CartTotals;
  customerName?: string;
  customerPhone?: string;
  discountInfo?: {
    name: string;
    value: number;
    amount: number;
  } | null;
  onOpenChange: (open: boolean) => void;
};

const Divider = () => (
  <div className="my-2 border-t border-dashed border-[#C9C9C9]" />
);

const ReceiptDialog = ({
  open,
  orderNumber,
  orderType,
  table,
  items,
  totals,
  customerName,
  customerPhone,
  discountInfo,
  onOpenChange,
}: ReceiptDialogProps) => {
  const { t } = useTranslation();

  const discountAmt = discountInfo?.amount || totals.discount || 0;
  const netTotal = Math.max(0, totals.total - discountAmt);

  const handlePrint = () => {
    const now = new Date();
    const printTime = now.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const printDate = now.toLocaleDateString("ar-EG");

    const orderTypeLabel =
      orderType === "dine-in"
        ? table
          ? `طاولة: ${table}`
          : "صالة"
        : "تيك أواي";

    const customerReceiptHtml = generateCustomerReceiptHtml({
      orderNumber: String(orderNumber),
      date: printDate,
      time: printTime,
      orderType: orderType === "dine-in" ? "dine-in" : "takeaway",
      tableNumber: table,
      customerName: customerName,
      customerPhone: customerPhone,
      paymentMethod: "Cash",
      status: "paid",
      subtotal: totals.subtotal + (totals.extras || 0),
      discount: discountAmt,
      discountName: discountInfo?.name ? `${discountInfo.value}% ${discountInfo.name}` : undefined,
      tax: totals.tax,
      total: netTotal,
      items: items.map((item) => {
        const selectedExtras = (item.extras || []).filter((e) => e.selected);
        return {
          name: item.name,
          qty: item.qty,
          unitPrice: item.unitPrice,
          totalPrice: lineTotal(item),
          options: (item as any).variants?.map((v: any) => `${v.name || v.group}: ${v.option}`) || [],
          extras: selectedExtras.map((e) => `+ ${e.name}${(e.price || 0) > 0 ? ` (${formatEgp(item.qty * e.price)})` : ""}`),
          note: item.instructions || undefined,
        };
      }),
    });

    const win = window.open("", "_blank", "width=400,height=600");
    if (win) {
      win.document.write(customerReceiptHtml);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 250);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[380px] max-w-[calc(100%-2rem)] gap-0 rounded-[16px] border border-[#E5E5E5] bg-white p-6 sm:max-w-[380px]"
      >
        <div className="mx-auto w-full max-w-[300px] rounded-[6px] border border-[#ECECEC] bg-white p-5 font-mono text-[11px] leading-5 text-[#333333]">
          <div className="text-center">
            <p className="text-[15px] font-bold">Patria Restaurant</p>
            <p dir="rtl" className="text-[13px] font-bold">
              مطعم باتريا
            </p>
          </div>

          <Divider />

          <div className="flex justify-between">
            <span>{t("Order")} #</span>
            <span className="font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("Order Type")}</span>
            <span>
              {orderType === "dine-in"
                ? `${t("Dine-in")} · ${table}`
                : t("Takeaway")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("Cashier")}</span>
            <span>Mariam</span>
          </div>

          <Divider />

          <div className="space-y-1.5">
            {items.map((item) => (
              <div key={item.lineId} className="flex justify-between gap-2">
                <span className="min-w-0 truncate">
                  {item.qty} × {item.name}
                </span>
                <span className="shrink-0">{formatEgp(lineTotal(item))}</span>
              </div>
            ))}
          </div>

          <Divider />

          <div className="flex justify-between">
            <span>{t("Subtotal")}</span>
            <span>{formatEgp(totals.subtotal)}</span>
          </div>
          {totals.extras > 0 && (
            <div className="flex justify-between">
              <span>{t("Extras")}</span>
              <span>{formatEgp(totals.extras)}</span>
            </div>
          )}
          {discountAmt > 0 && (
            <div className="flex justify-between text-[#C90000] font-semibold">
              <span>
                {t("Discount")}{" "}
                {discountInfo?.name ? `(${discountInfo.value}% ${discountInfo.name})` : ""}
              </span>
              <span>-{formatEgp(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t("Tax (14%)")}</span>
            <span>{formatEgp(totals.tax)}</span>
          </div>

          <Divider />

          <div className="flex justify-between text-[13px] font-bold">
            <span>{t("Total")}</span>
            <span>{formatEgp(netTotal)}</span>
          </div>

          <Divider />

          <p className="text-center text-[10px] text-[#8B8B8B]">
            {t("Thank you for your visit!")}
          </p>
        </div>

        <DialogFooter className="mt-5 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>
          <Button
            className="h-12 flex-1 rounded-[8px] bg-primary text-[13px] font-semibold text-white cursor-pointer"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            {t("Print Receipt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
