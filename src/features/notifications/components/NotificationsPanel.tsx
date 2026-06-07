import { useMemo, useState } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { INITIAL_NOTIFICATIONS } from "../data";
import type { AppNotification, NotificationTab } from "../types";
import NotificationItem from "./NotificationItem";

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS: { value: NotificationTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "orders", label: "Orders" },
  { value: "stock", label: "Stock" },
  { value: "system", label: "System" },
];

const NotificationsPanel = ({ open, onOpenChange }: NotificationsPanelProps) => {
  const { t, dir } = useTranslation();
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  const counts = useMemo(
    () => ({
      all: notifications.length,
      orders: notifications.filter((n) => n.category === "orders").length,
      stock: notifications.filter((n) => n.category === "stock").length,
      system: notifications.filter((n) => n.category === "system").length,
    }),
    [notifications],
  );

  const resolvedCount = useMemo(
    () => notifications.filter((n) => n.resolved).length,
    [notifications],
  );

  const visible = useMemo(
    () =>
      activeTab === "all"
        ? notifications
        : notifications.filter((n) => n.category === activeTab),
    [notifications, activeTab],
  );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const resolve = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, resolved: true, read: true } : n)),
    );

  const removeOne = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={dir === "rtl" ? "left" : "right"}
        showCloseButton={false}
        className="w-full gap-0 bg-white p-0 sm:max-w-md"
      >
        <SheetDescription className="sr-only">
          {t("Notifications")}
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-[#28293D]" />
            <SheetTitle className="text-[18px] font-bold text-[#333333]">
              {t("Notifications")}
            </SheetTitle>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={markAllRead}
              aria-label={t("Mark all as read")}
              className="cursor-pointer text-[#595959] hover:text-[#28293D]"
            >
              <CheckCheck size={18} />
            </button>
            <button
              type="button"
              onClick={clearAll}
              aria-label={t("Clear all")}
              className="cursor-pointer text-[#C90000]"
            >
              <Trash2 size={18} />
            </button>
            <SheetClose asChild>
              <button
                type="button"
                aria-label={t("Close")}
                className="cursor-pointer text-[#000000]"
              >
                <X size={18} />
              </button>
            </SheetClose>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3 sm:px-5">
          <div className="flex items-center gap-1 rounded-[16px] bg-[#F5F0EA] p-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-[12px] px-2 py-2 text-[12px] font-semibold transition-colors sm:text-[13px]",
                    isActive
                      ? "bg-white text-[#333333] shadow-sm"
                      : "text-[#8B8B8B] hover:text-[#28293D]",
                  )}
                >
                  {t(tab.label)}
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-white text-[#8B8B8B]",
                    )}
                  >
                    {counts[tab.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 divide-y divide-[#E5E5E5] overflow-y-auto border-t border-[#CACBD4]">
          {visible.length === 0 ? (
            <p className="px-4 py-12 text-center text-[14px] text-[#8B8B8B]">
              {t("No notifications")}
            </p>
          ) : (
            visible.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAccept={removeOne}
                onDecline={removeOne}
                onResolve={resolve}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#CACBD4] px-4 py-3 text-[13px] text-[#595959] sm:px-5">
          {counts.all} {t("total")} · {resolvedCount} {t("resolved")}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
