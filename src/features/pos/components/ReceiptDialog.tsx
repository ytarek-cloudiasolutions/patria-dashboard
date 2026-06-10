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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[360px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-5 sm:max-w-[360px]"
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
            className="h-12 flex-1 rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>
          <Button
            className="h-12 flex-1 rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
            onClick={() => window.print()}
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
