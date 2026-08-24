import { ShoppingBag, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { IncomingOrder } from "./IncomingOrderWatcher";

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

  const orderDisplayId = order.orderId.startsWith("#") ? order.orderId : `#${order.orderId}`;

  return (
    <Dialog open={!!order} onOpenChange={() => { }}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[610px] max-w-[610px] sm:max-w-[610px] overflow-hidden rounded-[12px] border-[6px] border-[#8F6900] bg-white pt-8 pb-6 px-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] ring-0 outline-none flex flex-col gap-6"
      >
        {/* Header Row */}
        <div className="flex items-center gap-4 text-start">
          <div className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-[20.89px] bg-[#FAFAF7]">
            <ShoppingBag className="size-[24px] text-[#8F6900]" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-[16px] font-normal leading-[22.4px] tracking-[0.32px] text-[#595959]">
              {t("New Order · App Order")}
            </span>
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-[#28293D]" dir="ltr">
              {orderDisplayId}
            </DialogTitle>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full border-t border-[#CACBD4]" />

        {/* Customer Details Card */}
        <div className="flex flex-col gap-2.5 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 text-start">
          <p className="text-[16px] font-semibold leading-[17.12px] tracking-[0.32px] text-[#333333]">
            {order.customer.name}
          </p>
          {order.customer.phone && (
            <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.24px] text-[#595959]" dir="ltr">
              <Phone className="size-3.5 text-[#595959]" />
              <span>{order.customer.phone}</span>
            </div>
          )}
          {order.customer.address && (
            <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.24px] text-[#595959]">
              <MapPin className="size-3.5 text-black" />
              <span>{order.customer.address}</span>
            </div>
          )}
        </div>

        {/* Items & Total Card */}
        <div className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 text-start">
          <div className="flex flex-col gap-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-black">
                  {item.quantity}X {item.name}
                </span>
                <span className="font-medium text-[#28293D]" dir="ltr">
                  {formatEgp(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-[#CACBD4]" />

          <div className="flex items-center justify-between text-[18px]">
            <span className="font-semibold text-black">{t("Total:")}</span>
            <span className="text-black" dir="ltr">
              <span className="font-medium">EGP </span>
              <span className="font-semibold">{Number(order.total || 0).toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* Confirm Order Button */}
        <button
          type="button"
          disabled={isConfirming}
          onClick={onConfirm}
          className="flex h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-[#059B5A] bg-[#E2F4ED] text-[16px] font-semibold text-[#059B5A] transition-colors hover:bg-[#E2F4ED]/80 disabled:opacity-60"
        >
          {isConfirming ? (
            <Loader2 className="size-5 animate-spin text-[#059B5A]" />
          ) : (
            <CheckCircle2 className="size-5 text-[#059B5A]" />
          )}
          {t("Confirm Order")}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingOrderDialog;
