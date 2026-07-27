import { Info, Coffee, ShoppingBag, Bike, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";

export interface ReportOrder {
  id: string;
  orderId: string;
  date: string;
  type: string;
  status: string;
  total: number;
  payment: string;
  itemsCount: number;
  customerName?: string;
}

interface ReportOrderDetailsDialogProps {
  open: boolean;
  order: ReportOrder | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-[rgba(254,154,0,0.1)] text-[#C7861E] border border-[#C7861E]",
  pending: "bg-[rgba(254,154,0,0.1)] text-[#C7861E] border border-[#C7861E]",
  Preparing: "bg-[#F5F0EA] text-[#8F6900] border border-[#725400]",
  preparing: "bg-[#F5F0EA] text-[#8F6900] border border-[#725400]",
  Confirmed: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  confirmed: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  "On The Way": "bg-[#F3E9FA] text-[#7E00D7] border border-[#7E00D7]",
  Delivered: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  delivered: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  Cancelled: "bg-[#C90000] text-white border border-[#C90000]",
  cancelled: "bg-[#C90000] text-white border border-[#C90000]",
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatType = (type: string) => {
  if (!type) return "";
  const lower = type.toLowerCase();
  if (lower.includes("dine")) return "Dine-In";
  if (lower.includes("take")) return "Takeaway";
  if (lower.includes("deliv")) return "Delivery";
  if (lower.includes("call")) return "Call";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const formatPayment = (payment: string) => {
  if (!payment) return "";
  const lower = payment.toLowerCase();
  if (lower === "cash") return "Cash";
  if (lower === "cod" || lower.includes("delivery")) return "Cash on Delivery";
  if (lower.includes("online") || lower.includes("card")) return "Online Payment";
  return payment.charAt(0).toUpperCase() + payment.slice(1);
};

const TypeIcon = ({ type }: { type: string }) => {
  const normalized = type?.toLowerCase() || "";
  if (normalized.includes("dine")) return <Coffee className="size-4 text-[#28293D]" />;
  if (normalized.includes("take")) return <ShoppingBag className="size-4 text-[#28293D]" />;
  if (normalized.includes("deliv")) return <Bike className="size-4 text-[#28293D]" />;
  if (normalized.includes("call")) return <Phone className="size-4 text-[#28293D]" />;
  return <ShoppingBag className="size-4 text-[#28293D]" />;
};

const ReportOrderDetailsDialog = ({
  open,
  order,
  onOpenChange,
}: ReportOrderDetailsDialogProps) => {
  const { t } = useTranslation();

  if (!order) return null;

  const rawId = order.orderId || order.id;
  const displayId = `#${rawId.replace(/^#/, "")}`;
  const customerName = order.customerName || t("Omnia Maher");
  const formattedDate = formatDate(order.date);
  const formattedType = formatType(order.type);
  const formattedPayment = formatPayment(order.payment);
  const formattedStatus = order.status
    ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
    : "Pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        <div className="flex flex-col p-6 gap-6">
          {/* Header */}
          <DialogTitle className="text-[24px] font-bold text-[#28293D]">
            {displayId}
          </DialogTitle>

          {/* Subcard 1: Order Overview */}
          <div className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#595959] uppercase tracking-wide">
                  {t("CUSTOMER")}
                </span>
                <span className="text-[16px] font-semibold text-[#28293D]">
                  {customerName}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-medium text-[#595959] uppercase tracking-wide">
                  {t("DATE")}
                </span>
                <span className="text-[14px] text-[#28293D]">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#595959] uppercase tracking-wide">
                  {t("TYPE")}
                </span>
                <div className="flex items-center gap-1.5 text-[14px] font-medium text-[#28293D]">
                  <TypeIcon type={order.type} />
                  <span>{t(formattedType)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-medium text-[#595959] uppercase tracking-wide">
                  {t("STATUS")}
                </span>
                <span
                  className={`inline-flex items-center rounded-[30px] px-3 py-0.5 text-[13px] font-medium ${
                    STATUS_STYLES[order.status] ??
                    STATUS_STYLES[formattedStatus] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t(formattedStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Subcard 2: Products Count & Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 sm:p-5">
              <span className="text-[16px] font-semibold text-[#28293D]">
                {t("Number of Products")} :{order.itemsCount}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[10px] bg-[#E5E5E5] p-3 px-4">
              <Info className="size-4 shrink-0 text-[#28293D]" />
              <span className="text-[12px] text-[#28293D]">
                {t("For more details, please visit the order details page.")}
              </span>
            </div>
          </div>

          {/* Subcard 3: Payment & Total */}
          <div className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-bold text-[#000000]">
                {t("Total:")}
              </span>
              <span className="text-[20px] font-bold text-[#000000]">
                <span className="text-[18px] font-normal mr-1">EGP</span>
                {order.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-start">
              <span className="inline-flex items-center rounded-[30px] border border-[#004EF9] bg-[#EDF4FB] px-3 py-1 text-[13px] font-medium text-[#3574FF]">
                {t(formattedPayment)}
              </span>
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Footer */}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-14 min-w-[95px] cursor-pointer items-center justify-center rounded-[5px] bg-[#8F6900] px-[30px] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90"
            >
              {t("Close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportOrderDetailsDialog;
