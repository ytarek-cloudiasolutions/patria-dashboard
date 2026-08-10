import { CheckCircle2, Printer, Utensils, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartItem } from "../types";
import { formatEgp } from "../utils";

type OrderConfirmedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  totalAmount: number;
  customerName?: string;
  orderType?: string;
  selectedTable?: string;
  cartItems?: CartItem[];
  paymentMethod?: string;
  onNewOrder: () => void;
};

const OrderConfirmedDialog = ({
  open,
  onOpenChange,
  orderNumber,
  totalAmount,
  customerName = "Walk-in Customer",
  orderType = "dine-in",
  selectedTable = "",
  cartItems = [],
  paymentMethod = "cash",
  onNewOrder,
}: OrderConfirmedDialogProps) => {
  const { t } = useTranslation();

  const handlePrint = (type: "customer" | "kitchen") => {
    const now = new Date();
    const printTime = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    const printDate = now.toLocaleDateString("ar-EG");
    const displayId = orderNumber.replace(/^#/, "");

    const kitchenHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>Kitchen Ticket - طلب #${displayId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: monospace; font-size: 13px; width: 80mm; padding: 10px; color: #000; }
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
        </style>
      </head>
      <body>
        <div class="center">
          <div class="header-title">Patria Restaurant</div>
          <div class="kitchen-label">*** تذكرة المطبخ ***</div>
        </div>
        <div class="divider"></div>
        <div class="order-num"># ${displayId}</div>
        <div class="order-type-wrap">
          <span class="order-type">${orderType === "dine-in" ? `صالة - ${selectedTable || "بدون طاولة"}` : "تيك أواي"}</span>
        </div>
        <div class="divider-thin"></div>
        <div class="row">
          <span>العميل:</span>
          <span>${customerName}</span>
        </div>
        <div class="row">
          <span>الوقت:</span>
          <span>${printTime}</span>
        </div>
        <div class="divider"></div>
        ${cartItems.map((item, index) => `
          <div style="margin: 6px 0;">
            <div class="row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">× ${item.qty}</span>
            </div>
            ${item.extras?.filter(e => e.selected).map(e => `
              <div class="modifier">+ ${e.name}</div>
            `).join("") || ""}
            ${item.instructions ? `<div class="note">ملاحظة: ${item.instructions}</div>` : ""}
          </div>
          ${index < cartItems.length - 1 ? '<div class="divider-thin"></div>' : ""}
        `).join("")}
        <div class="divider"></div>
      </body>
      </html>
    `;

    const customerHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>Customer Receipt - طلب #${displayId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 10px; color: #000; }
          .center { text-align: center; }
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
          .modifier { font-size: 10px; color: #555; padding-right: 10px; margin: 1px 0; }
          .total-row { font-size: 14px; font-weight: bold; }
          .payment-badge { display: inline-block; border: 1px solid #000; padding: 2px 8px; font-size: 11px; font-weight: bold; margin-top: 4px; }
          .thank-you { font-size: 12px; font-weight: bold; margin-top: 4px; }
          .footer-note { font-size: 10px; color: #555; margin-top: 2px; }
        </style>
      </head>
      <body>
        <div class="center">
          <div class="restaurant-name">Patria Restaurant</div>
          <div class="restaurant-ar">مطعم باتريا</div>
          <div class="receipt-label">*** فاتورة العميل ***</div>
        </div>
        <div class="divider-solid"></div>
        <div class="row">
          <span>رقم الطلب:</span>
          <span class="order-num">#${displayId}</span>
        </div>
        <div class="row">
          <span>نوع الطلب:</span>
          <span>${orderType === "dine-in" ? `صالة (${selectedTable || "بدون طاولة"})` : "تيك أواي"}</span>
        </div>
        <div class="row">
          <span>العميل:</span>
          <span>${customerName}</span>
        </div>
        <div class="row">
          <span>التاريخ والوقت:</span>
          <span>${printDate} ${printTime}</span>
        </div>
        <div class="divider"></div>
        <div class="section-label">الأصناف</div>
        ${cartItems.map((item) => `
          <div style="margin: 4px 0;">
            <div class="row">
              <span class="item-name">${item.name} × ${item.qty}</span>
              <span class="item-price">EGP ${(item.unitPrice * item.qty).toFixed(2)}</span>
            </div>
            ${item.extras?.filter(e => e.selected).map(e => `
              <div class="modifier">+ ${e.name} (${e.price.toFixed(2)} EGP)</div>
            `).join("") || ""}
            ${item.instructions ? `<div class="modifier">ملاحظة: ${item.instructions}</div>` : ""}
          </div>
        `).join("")}
        <div class="divider"></div>
        <div class="row total-row">
          <span>الإجمالي:</span>
          <span>EGP ${totalAmount.toFixed(2)}</span>
        </div>
        <div class="divider-solid"></div>
        <div class="center">
          <div class="payment-badge">طريقة الدفع: ${paymentMethod.toUpperCase()}</div>
          <div class="thank-you" style="margin-top: 10px;">شكراً لزيارتكم!</div>
          <div class="footer-note">Patria Restaurant - Point of Sale</div>
        </div>
      </body>
      </html>
    `;

    const html = type === "customer" ? customerHtml : kitchenHtml;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
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
        className="w-[529px] max-w-[calc(100%-2rem)] gap-6 rounded-[16px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[529px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Order Confirmed")}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-full text-[#8B8B8B] transition-colors hover:bg-[#FAFAF7] hover:text-black cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Center Check Circle & Order Info */}
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-[#059B5A]/10 text-[#059B5A]">
            <CheckCircle2 className="size-12 stroke-[2.25]" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] font-bold text-[#333333]">
              {t("Order Placed!")}
            </h2>
            <p className="text-[14px] font-medium text-[#595959]">
              {t("Reference")}: <span className="font-semibold text-[#333333]">#{orderNumber}</span>
            </p>
            <p className="text-[14px] font-medium text-[#595959]">
              {t("Total")}: <span className="font-bold text-[#059B5A]">{formatEgp(totalAmount)}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Customer Receipt & Kitchen Ticket */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => handlePrint("customer")}
            className="flex h-[56px] items-center justify-center gap-2.5 rounded-[8px] border border-[#8F6900] bg-white px-3 text-[14px] font-semibold text-[#8F6900] cursor-pointer"
          >
            <Printer className="size-5 text-[#8F6900]" />
            {t("Print Customer Receipt")}
          </button>

          <button
            type="button"
            onClick={() => handlePrint("kitchen")}
            className="flex h-[56px] items-center justify-center gap-2.5 rounded-[8px] bg-[#8F6900] px-3 text-[14px] font-semibold text-white cursor-pointer"
          >
            <Printer className="size-5 text-white" />
            {t("Print Kitchen Receipt")}
          </button>
        </div>

        {/* New Order Primary Button */}
        <div className="pt-2">
          <Button
            type="button"
            className="flex h-[56px] w-full items-center justify-center rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white cursor-pointer hover:bg-[#8F6900]"
            onClick={() => {
              onOpenChange(false);
              onNewOrder();
            }}
          >
            {t("New Order")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmedDialog;
