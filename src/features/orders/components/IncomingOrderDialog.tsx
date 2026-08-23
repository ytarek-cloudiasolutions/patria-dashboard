import { ShoppingBag, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { IncomingOrder } from "./IncomingOrderWatcher";

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

interface IncomingOrderDialogProps {
  order: IncomingOrder | null;
  isConfirming: boolean;
  onConfirm: () => void;
}

/**
 * Real-time popup for a new order placed from the customer app. Stays open
 * (with a looping alert sound driven by the parent watcher) until staff
 * explicitly confirms it — closing via backdrop/escape is disabled on
 * purpose so a new order can never be silently missed.
 */
const IncomingOrderDialog = ({ order, isConfirming, onConfirm }: IncomingOrderDialogProps) => {
  const { t } = useTranslation();
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-115"
      >
        <div className="flex items-center gap-3 bg-[#C90000] px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/20">
            <ShoppingBag className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-[13px] font-medium text-white/90">
              {t("New Order — from the app")}
            </DialogTitle>
            <p className="truncate text-[18px] font-bold text-white" dir="ltr">
              #{order.orderId}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div>
            <p className="text-[16px] font-bold text-[#28293D]">{order.customer.name}</p>
            <div className="mt-1.5 flex flex-col gap-1 text-[13px] text-[#595959]">
              {order.customer.phone && (
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Phone size={14} className="shrink-0" />
                  {order.customer.phone}
                </div>
              )}
              {order.customer.address && (
                <div className="flex items-start gap-1.5">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{order.customer.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[14px]">
                <span className="text-[#28293D]">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-medium text-[#28293D]" dir="ltr">
                  {formatEgp(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-3">
            <span className="text-[15px] font-semibold text-[#28293D]">{t("Total")}</span>
            <span className="text-[20px] font-bold text-[#C90000]" dir="ltr">
              {formatEgp(order.total)}
            </span>
          </div>

          <Button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#059B5A] text-[16px] font-semibold text-white hover:bg-[#04824c] disabled:opacity-60"
          >
            {isConfirming ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}
            {t("Confirm Order")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingOrderDialog;
