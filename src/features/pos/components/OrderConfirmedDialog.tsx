import { Banknote, CheckCheck, Printer, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartItem } from "../types";
import { formatEgp } from "../utils";
import { generateKitchenReceiptHtml } from "@/features/orders/utils/kitchenReceipt";
import { generateCustomerReceiptHtml } from "@/features/orders/utils/customerReceipt";

export type OrderConfirmedMode = "order" | "payment";

export type OrderConfirmedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  orderType?: string;
  selectedTable?: string;
  cartItems?: CartItem[];
  paymentMethod?: string;
  guestCount?: number;
  mode?: OrderConfirmedMode;
  notes?: string;
  onNewOrder: () => void;
};

const OrderConfirmedDialog = ({
  open,
  onOpenChange,
  orderNumber,
  totalAmount,
  customerName = "Walk-in Customer",
  customerPhone,
  orderType = "dine-in",
  selectedTable = "",
  cartItems = [],
  paymentMethod = "cash",
  guestCount = 0,
  mode = "payment",
  notes,
  onNewOrder,
}: OrderConfirmedDialogProps) => {
  const { t } = useTranslation();
  const calculatedCostPerPerson =
    guestCount > 0 ? totalAmount / guestCount : totalAmount;

  const isOrderMode = mode === "order";

  const handlePrint = (type: "customer" | "kitchen") => {
    const now = new Date();
    const printTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const printDate = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });

    const kitchenHtml = generateKitchenReceiptHtml({
      orderNumber: String(orderNumber),
      orderType: orderType === "dine-in" ? "dine-in" : "takeaway",
      tableNumber: selectedTable || "",
      customerName: customerName,
      date: printDate,
      time: printTime,
      brandName: "Patria Restaurant",
      notes: notes,
      items: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        options: (item as any).variants?.map((v: any) => `${v.name || v.group}: ${v.option}`) || [],
        extras: item.extras?.filter((e) => e.selected).map((e) => `+ ${e.name}`) || [],
        excluded: (item as any).excludedIngredients || [],
        note: item.instructions || undefined,
      })),
    });

    const subtotalCalc = cartItems.reduce((sum, item) => {
      const extrasTotal =
        item.extras?.filter((e) => e.selected).reduce((s, e) => s + (e.price || 0), 0) || 0;
      return sum + (item.unitPrice + extrasTotal) * item.qty;
    }, 0);

    const customerHtml = generateCustomerReceiptHtml({
      orderNumber: String(orderNumber),
      date: printDate,
      time: printTime,
      orderType: orderType === "dine-in" ? "dine-in" : "takeaway",
      tableNumber: selectedTable || "",
      customerName: customerName,
      customerPhone: customerPhone,
      paymentMethod: paymentMethod,
      status: "paid",
      subtotal: subtotalCalc > 0 ? subtotalCalc : totalAmount,
      total: totalAmount,
      guestCount: guestCount,
      costPerPerson: calculatedCostPerPerson,
      items: cartItems.map((item) => {
        const extrasTotal =
          item.extras?.filter((e) => e.selected).reduce((s, e) => s + (e.price || 0), 0) || 0;
        const itemLineTotal = (item.unitPrice + extrasTotal) * item.qty;
        return {
          name: item.name,
          qty: item.qty,
          unitPrice: item.unitPrice,
          totalPrice: itemLineTotal,
          options: (item as any).variants?.map((v: any) => `${v.name || v.group}: ${v.option}`) || [],
          extras: item.extras?.filter((e) => e.selected).map((e) => `+ ${e.name}${(e.price || 0) > 0 ? ` (${(e.price || 0).toFixed(2)} EGP)` : ""}`) || [],
          excluded: (item as any).excludedIngredients || [],
          note: item.instructions || undefined,
        };
      }),
    });

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
        className="w-[620px] max-w-[calc(100%-2rem)] sm:max-w-[620px] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)]"
      >
        {/* Header Title & Optional Close Button */}
        <div className="flex items-center justify-between">
          <DialogTitle className="text-[22px] font-bold text-black">
            {isOrderMode ? t("Order Confirmed") : t("Payment Confirmed!")}
          </DialogTitle>
          {orderType === "takeaway" && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-8 items-center justify-center rounded-full text-black hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="flex flex-col gap-6">
          {/* Status & Reference */}
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[8px] bg-[#E2F4ED] text-[#059B5A] shrink-0">
              <CheckCheck className="size-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-[#1F2937]">
                {isOrderMode ? t("Order Placed!") : t("Payment Confirmed!")}
              </h2>
              <p className="text-[13px] font-semibold text-black">
                {t("Reference")}: {orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`}
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Total Card */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-6 text-center">
              <Banknote className="size-5 text-black stroke-[1.8]" />
              <div className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-[12px] font-medium text-[#737373]">
                  {t("Total")}
                </span>
                <span className="text-[15px] font-bold text-black">
                  {formatEgp(totalAmount)}
                </span>
              </div>
            </div>

            {/* Cost per person Card */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-6 text-center">
              <Users className="size-5 text-black stroke-[1.8]" />
              <div className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-[12px] font-medium text-[#737373]">
                  {t("Cost per person")} ({guestCount || 1})
                </span>
                <span className="text-[15px] font-bold text-black">
                  {formatEgp(calculatedCostPerPerson)}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full border-t border-[#E5E5E5]" />

          {/* Actions */}
          {orderType === "takeaway" ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 w-full">
              <button
                type="button"
                onClick={() => handlePrint("customer")}
                className="flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#8F6900] bg-white px-4 text-[16px] font-semibold text-[#8F6900] whitespace-nowrap cursor-pointer"
              >
                <Printer className="size-5 shrink-0 text-[#8F6900]" />
                <span>{t("Print Customer Receipt")}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrint("kitchen")}
                className="flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white whitespace-nowrap cursor-pointer"
              >
                <Printer className="size-5 shrink-0 text-white" />
                <span>{t("Print Kitchen Receipt")}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-[56px] items-center justify-center rounded-[5px] border border-[#8F6900] bg-white px-[30px] py-4 text-[16px] font-semibold text-[#8F6900] whitespace-nowrap cursor-pointer"
              >
                {t("Cancel")}
              </button>

              <button
                type="button"
                onClick={() => handlePrint(isOrderMode ? "kitchen" : "customer")}
                className="flex h-[56px] items-center justify-center gap-2.5 rounded-[5px] bg-[#8F6900] px-[30px] py-4 text-[16px] font-semibold text-white whitespace-nowrap cursor-pointer"
              >
                <Printer className="size-5 shrink-0 text-white" />
                <span>
                  {isOrderMode
                    ? t("Print Kitchen Receipt")
                    : t("Print Customer Receipt")}
                </span>
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmedDialog;
