import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Info,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { AppNotification, NotificationCategory } from "../types";

interface NotificationItemProps {
  notification: AppNotification;
  onAccept: (id: number | string) => void;
  onDecline: (id: number | string) => void;
  onResolve: (id: number | string) => void;
  onClick?: (id: number | string) => void;
  onClosePanel?: () => void;
}

const CATEGORY_ICON: Record<
  NotificationCategory,
  { icon: LucideIcon; bg: string; color: string }
> = {
  stock: { icon: AlertTriangle, bg: "bg-[#C90000]", color: "text-white" },
  orders: { icon: ShoppingBag, bg: "bg-[#DBEAFE]", color: "text-[#155DFC]" },
  system: { icon: Info, bg: "bg-[#F5F0EA]", color: "text-[#8F6900]" },
};

const NotificationItem = ({
  notification,
  onAccept,
  onDecline,
  onResolve,
  onClick,
  onClosePanel,
}: NotificationItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { icon: Icon, bg, color } = CATEGORY_ICON[notification.category];

  const handleViewInventory = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResolve(notification.id);
    onClosePanel?.();
    navigate("/inventory");
  };

  return (
    <div
      onClick={() => onClick?.(notification.id)}
      role={notification.category === "orders" ? "button" : undefined}
      className={cn(
        "flex gap-3 px-4 py-3.5 sm:px-5 transition-colors border-b border-[#E5E5E5] last:border-b-0",
        notification.category === "orders" && "cursor-pointer hover:bg-[#F5F0EA]/40",
        !notification.read && "bg-[#FAFAF7]",
      )}
    >
      {/* Circular Icon Badge */}
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full mt-0.5",
          bg,
        )}
      >
        <Icon className={cn("size-5", color)} />
      </span>

      {/* Content Body */}
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-[#333333] leading-snug">
              {t(notification.title)}
            </h4>
            <p className="mt-1 text-[12px] font-normal leading-[16.8px] text-[#8B8B8B]">
              {notification.description}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-normal text-[#595959] pt-0.5">
            {notification.time}
          </span>
        </div>

        {/* Stock Action Tag */}
        {notification.category === "stock" && (
          <div className="mt-1">
            <button
              type="button"
              onClick={handleViewInventory}
              className="inline-flex items-center gap-1 rounded-[30px] border border-[#C90000] bg-[#C90000] px-3 py-1 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Info className="size-3 text-white" />
              <span>{t("View Inventory")}</span>
            </button>
          </div>
        )}

        {/* Order Actions */}
        {notification.category === "orders" && (
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDecline(notification.id);
              }}
              className="h-8 cursor-pointer rounded-[5px] border border-[#8F6900] px-3 text-[12px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA]"
            >
              {t("Decline")}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(notification.id);
              }}
              className="h-8 cursor-pointer rounded-[5px] bg-[#8F6900] px-3 text-[12px] font-semibold text-white hover:opacity-90"
            >
              {t("Accept")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
