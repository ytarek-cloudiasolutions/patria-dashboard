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
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onResolve: (id: number) => void;
}

const CATEGORY_ICON: Record<
  NotificationCategory,
  { icon: LucideIcon; bg: string; color: string }
> = {
  stock: { icon: AlertTriangle, bg: "bg-[#FFF0F0]", color: "text-[#C90000]" },
  orders: { icon: ShoppingBag, bg: "bg-[#DBEAFE]", color: "text-[#155DFC]" },
  system: { icon: Info, bg: "bg-[#F5F0EA]", color: "text-primary" },
};

const NotificationItem = ({
  notification,
  onAccept,
  onDecline,
  onResolve,
}: NotificationItemProps) => {
  const { t } = useTranslation();
  const { icon: Icon, bg, color } = CATEGORY_ICON[notification.category];

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-4 sm:px-5",
        !notification.read && "bg-[#FAFAF7]",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          bg,
        )}
      >
        <Icon size={18} className={color} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#333333]">
              {notification.title}
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#8B8B8B]">
              {notification.description}
            </p>
          </div>
          <span className="shrink-0 text-[12px] whitespace-nowrap text-[#595959]">
            {notification.time}
          </span>
        </div>

        {/* Actions */}
        {notification.category === "stock" && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onResolve(notification.id)}
              className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-[#C90000] bg-[#FFF0F0] px-3 text-[12px] font-semibold text-[#C90000]"
            >
              <Info size={12} />
              {t("View Inventory")}
            </button>
          </div>
        )}

        {notification.category === "orders" && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDecline(notification.id)}
              className="h-9 cursor-pointer rounded-[5px] border border-primary px-4 text-[13px] font-semibold text-primary hover:bg-[#F5F0EA]"
            >
              {t("Decline")}
            </button>
            <button
              type="button"
              onClick={() => onAccept(notification.id)}
              className="h-9 cursor-pointer rounded-[5px] bg-primary px-4 text-[13px] font-semibold text-white hover:opacity-90"
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
