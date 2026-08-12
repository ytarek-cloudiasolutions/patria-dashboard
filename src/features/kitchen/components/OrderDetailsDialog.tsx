import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Clock3, UserRound, Smartphone } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { KitchenOrder } from "../store/kitchenTypes";
import { formatTimeAgo } from "@/shared/utils/dateUtils";

interface OrderDetailsDialogProps {
  order: KitchenOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending:   { bg: "#F5F0EA", text: "#624F1C", border: "#C8A96E", label: "Pending" },
  confirmed: { bg: "#E8F4FD", text: "#1565C0", border: "#1565C0", label: "Confirmed" },
  preparing: { bg: "#FE9A001A", text: "#C7861E", border: "#C7861E", label: "Preparing" },
  ready:     { bg: "#E2F4ED", text: "#059B5A", border: "#059B5A", label: "Ready" },
  served:    { bg: "#F0F0F0", text: "#666666", border: "#999999", label: "Served" },
};



function getCustomerName(order: KitchenOrder): string {
  if (!order.customer) return "Walk-in";
  if (typeof order.customer === "string") return order.customer;
  return order.customer.name ?? "Walk-in";
}

function getCustomerPhone(order: KitchenOrder): string {
  if (!order.customer || typeof order.customer === "string") return "";
  return order.customer.phone ?? "";
}

const OrderDetailsDialog = ({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) => {
  const { t } = useTranslation();

  if (!order) return null;

  const statusStyle = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[696px] p-6 bg-white rounded-2xl border border-[#E5E5E5] outline-none gap-8"
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <DialogTitle className="text-[24px] font-bold text-[#333333]">
            {order.orderNumber ?? `#${order._id.slice(-6).toUpperCase()}`}
          </DialogTitle>
          <Badge
            className="rounded-[30px] border px-3 py-1 text-[13px] font-normal"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              borderColor: statusStyle.border,
            }}
          >
            {t(statusStyle.label)}
          </Badge>
        </DialogHeader>

        {/* Customer & Time Info Card */}
        <div className="rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 text-[13px] text-[#595959] space-y-3">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-[#8B8B8B]" />
            <span>
              {t("Received")} {formatTimeAgo(order.createdAt, t)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 text-[#8B8B8B]" />
            <span>{getCustomerName(order)}</span>
            {order.table && (
              <span className="text-[#8B8B8B]">
                · {t("Table")} {order.table}
              </span>
            )}
          </div>
          {getCustomerPhone(order) && (
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-[#8B8B8B]" />
              <span dir="ltr">{getCustomerPhone(order)}</span>
            </div>
          )}
        </div>

        {/* Order Items Container styled as Figma Order Overview Card */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-[#FAFAF7] p-4 flex flex-col gap-4">
          <h4 className="text-[13px] font-semibold text-[#8B8B8B] tracking-wider uppercase">
            {t("Orders")}
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-[10px] border border-[#E5E5E5] bg-white p-4"
              >
                <div className="text-[15px] font-semibold text-[#333333]">
                  <span>{item.quantity}X </span>
                  <span>{item.name}</span>
                </div>
                {item.notes && (
                  <span className="self-start rounded-full border border-[#C7861E]/30 bg-[#FE9A001A] px-2.5 py-0.5 text-[11px] font-semibold text-[#C7861E]">
                    {item.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <hr className="border-[#E5E5E5] -mx-6" />

        {/* Footer Actions */}
        <div className="flex justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="flex h-14 items-center justify-center rounded-[5px] border border-primary bg-white px-[30px] py-4 text-[16px] font-semibold text-primary transition hover:bg-[#F5F0EA]/30 cursor-pointer"
            >
              {t("Cancel")}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
