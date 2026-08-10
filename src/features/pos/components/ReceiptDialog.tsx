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

type ReceiptDialogProps = {
  open: boolean;
  orderNumber: string;
  orderType: OrderType;
  table: string;
  items: CartItem[];
  totals: CartTotals;
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
  onOpenChange,
}: ReceiptDialogProps) => {
  const { t } = useTranslation();

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

    const customerReceiptHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>Customer Receipt - طلب #${orderNumber}</title>
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
          <span class="order-num">طلب # ${orderNumber}</span>
          <span style="font-size:11px">${printDate} ${printTime}</span>
        </div>
        <div class="row">
          <span style="font-size:11px">نوع الطلب:</span>
          <span style="font-size:11px; font-weight:bold">${orderTypeLabel}</span>
        </div>
        <div class="row">
          <span style="font-size:11px">الكاشير:</span>
          <span style="font-size:11px; font-weight:bold">Mariam</span>
        </div>

        <div class="divider"></div>

        <!-- Items -->
        <div class="section-label">الطلبات</div>
        ${items
          .map((item) => {
            const selectedExtras = (item.extras || []).filter(
              (e) => e.selected
            );
            const lineVal = lineTotal(item);
            return `
            <div style="margin: 5px 0;">
              <div class="row">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formatEgp(lineVal)}</span>
              </div>
              <div class="item-unit">${item.qty} × ${formatEgp(
              item.unitPrice
            )}</div>
              ${
                selectedExtras.length > 0
                  ? selectedExtras
                      .map(
                        (e) => `
                    <div class="row modifier">
                      <span>+ إضافة: ${e.name}</span>
                      ${
                        (e.price || 0) > 0
                          ? `<span>+${formatEgp(item.qty * e.price)}</span>`
                          : ""
                      }
                    </div>
                  `
                      )
                      .join("")
                  : ""
              }
              ${
                item.instructions
                  ? `<div class="modifier">ملاحظة: ${item.instructions}</div>`
                  : ""
              }
            </div>
          `;
          })
          .join("")}

        <div class="divider"></div>

        <!-- Totals -->
        <div class="row">
          <span>المجموع الفرعي:</span>
          <span>${formatEgp(totals.subtotal)}</span>
        </div>
        ${
          totals.extras > 0
            ? `
        <div class="row">
          <span>الإضافات:</span>
          <span>${formatEgp(totals.extras)}</span>
        </div>`
            : ""
        }
        ${
          totals.tax > 0
            ? `
        <div class="row">
          <span>الضريبة (14%):</span>
          <span>${formatEgp(totals.tax)}</span>
        </div>`
            : ""
        }

        <div class="divider-solid"></div>
        <div class="row total-row">
          <span>الإجمالي:</span>
          <span>${formatEgp(totals.total)}</span>
        </div>

        <div class="divider"></div>

        <!-- Footer -->
        <div class="center">
          <div class="thank-you">شكراً لزيارتكم 🙏</div>
          <div class="footer-note">نتطلع لخدمتكم مجدداً</div>
        </div>
      </body>
      </html>
    `;

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
          <div className="flex justify-between">
            <span>{t("Extras")}</span>
            <span>{formatEgp(totals.extras)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("Tax (14%)")}</span>
            <span>{formatEgp(totals.tax)}</span>
          </div>

          <Divider />

          <div className="flex justify-between text-[13px] font-bold">
            <span>{t("Total")}</span>
            <span>{formatEgp(totals.total)}</span>
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
