import { useEffect, useMemo, useState } from "react";
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
import { api } from "@/config/api";
import { notificationsApi } from "../api/notificationsApi";
import { getSocket } from "@/shared/lib/socket";
import type { AppNotification, NotificationCategory, NotificationTab } from "../types";
import NotificationItem from "./NotificationItem";
import OrderDetailsDialog from "@/features/orders/components/OrderDetailsDialog";
import { mapOrder } from "@/features/orders/utils/orderMappers";
import type { Order } from "@/features/orders/types";

const mapCategory = (type?: string, title?: string, message?: string): NotificationCategory => {
  const t = (type || "").toLowerCase();
  const text = `${type || ""} ${title || ""} ${message || ""}`.toLowerCase();

  // Stock / inventory
  if (
    t === "stock" ||
    t === "inventory" ||
    t.includes("stock") ||
    t.includes("inventory") ||
    text.includes("stock") ||
    text.includes("inventory") ||
    text.includes("مخزون") ||
    text.includes("المخزون") ||
    text.includes("نفاذ")
  ) {
    return "stock";
  }

  // Orders: English or Arabic keywords, order IDs, discount approval on orders
  if (
    t.includes("order") ||
    t.includes("discount") ||
    t.includes("approval") ||
    text.includes("order") ||
    text.includes("طلب") ||
    text.includes("الطلب") ||
    text.includes("اوردر") ||
    text.includes("#ord") ||
    text.includes("ord-")
  ) {
    return "orders";
  }

  return "system";
};

const mapNotification = (n: any, idx: number): AppNotification => {
  const msg = n.message ?? n.body ?? "";
  const title = n.title ?? n.type ?? "Notification";

  const orderIdMatch =
    n.orderId ||
    n.data?.orderId ||
    n.data?.order_id ||
    (typeof msg === "string" && (msg.match(/#?(ORD-[A-Za-z0-9]+)/i)?.[1] || msg.match(/#([A-Za-z0-9-]+)/)?.[1])) ||
    (typeof title === "string" && (title.match(/#?(ORD-[A-Za-z0-9]+)/i)?.[1] || title.match(/#([A-Za-z0-9-]+)/)?.[1])) ||
    undefined;

  return {
    id: n._id ?? idx,
    category: mapCategory(n.type, title, msg),
    title,
    description: msg,
    time: n.createdAt
      ? new Date(n.createdAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "—",
    read: n.isRead ?? false,
    resolved: false,
    orderId: orderIdMatch,
  };
};

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange?: (count: number) => void;
}

const TABS: { value: NotificationTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "orders", label: "Orders" },
  { value: "stock", label: "Stock" },
  { value: "system", label: "System" },
];

const NotificationsPanel = ({ open, onOpenChange, onUnreadCountChange }: NotificationsPanelProps) => {
  const { t, dir } = useTranslation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationsApi.getNotifications();
        const raw: any[] = res.notifications ?? [];
        setNotifications(raw.map(mapNotification));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifs();

    const socket = getSocket();
    const handleNewOrder = (raw: any) => {
      const orderId = raw.orderId || String(raw._id || "").slice(-6).toUpperCase();
      const custName = raw.customer?.name || "Walk-in";
      const newNotif: AppNotification = {
        id: raw._id || Date.now(),
        category: "orders",
        title: `New Order Alert #${orderId}`,
        description: `Order received from ${custName} (${raw.items?.length || 0} items) - EGP ${Number(raw.total || 0).toFixed(2)}`,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        read: false,
        resolved: false,
        orderId,
      };
      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
    };

    socket.on("newOrder", handleNewOrder);
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, []);

  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const handleOpenOrderDetails = async (notification: AppNotification) => {
    const notifId = String(notification.id);
    notificationsApi.markNotificationAsRead(notifId).catch(() => {});

    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    const targetOrderId =
      notification.orderId ||
      notification.description.match(/#?(ORD-[A-Za-z0-9]+)/i)?.[1] ||
      notification.title.match(/#?(ORD-[A-Za-z0-9]+)/i)?.[1] ||
      notification.description.match(/#([A-Za-z0-9-]+)/)?.[1] ||
      notification.title.match(/#([A-Za-z0-9-]+)/)?.[1];

    if (targetOrderId) {
      try {
        const res = await api.get(`/orders/${targetOrderId}`);
        const rawOrder = res.data?.data?.order || res.data?.data || res.data?.order || res.data;
        if (rawOrder && (rawOrder._id || rawOrder.orderId)) {
          setSelectedOrder(mapOrder(rawOrder));
          setIsOrderDetailsOpen(true);
          return;
        }
      } catch {}
    }

    try {
      const res = await api.get(`/orders/${notifId}`);
      const rawOrder = res.data?.data?.order || res.data?.data || res.data?.order || res.data;
      if (rawOrder && (rawOrder._id || rawOrder.orderId)) {
        setSelectedOrder(mapOrder(rawOrder));
        setIsOrderDetailsOpen(true);
        return;
      }
    } catch {}
  };

  const counts = useMemo(
    () => ({
      all: notifications.filter((n) => !n.read).length,
      orders: notifications.filter((n) => n.category === "orders" && !n.read).length,
      stock: notifications.filter((n) => n.category === "stock" && !n.read).length,
      system: notifications.filter((n) => n.category === "system" && !n.read).length,
    }),
    [notifications],
  );

  const visible = useMemo(
    () =>
      activeTab === "all"
        ? notifications
        : notifications.filter((n) => n.category === activeTab),
    [notifications, activeTab],
  );

  const markOneAsRead = (id: number | string) => {
    notificationsApi.markNotificationAsRead(String(id)).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    unread.forEach((n) => {
      notificationsApi.markNotificationAsRead(String(n.id)).catch(() => {});
    });
  };

  const clearAll = () => setNotifications([]);

  const resolve = (id: number | string) => {
    notificationsApi.markNotificationAsRead(String(id)).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, resolved: true, read: true } : n)),
    );
  };

  const removeOne = (id: number | string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <>
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
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <Bell className="size-6 text-[#333333]" />
              <SheetTitle className="text-[18px] font-bold text-[#333333] tracking-[0.36px]">
                {t("Notifications")}
              </SheetTitle>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={markAllRead}
                aria-label={t("Mark all as read")}
                className="cursor-pointer text-[#595959] hover:text-[#28293D] transition-colors"
                title={t("Mark all as read")}
              >
                <CheckCheck className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={clearAll}
                aria-label={t("Clear all")}
                className="cursor-pointer text-[#595959] hover:text-[#C90000] transition-colors"
                title={t("Clear all")}
              >
                <Trash2 className="size-[18px]" />
              </button>
              <SheetClose asChild>
                <button
                  type="button"
                  aria-label={t("Close")}
                  className="cursor-pointer text-[#333333] hover:text-black transition-colors"
                >
                  <X className="size-[18px]" />
                </button>
              </SheetClose>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="px-3.5 sm:px-5 pb-3">
            <div className="flex items-center gap-0.5 sm:gap-1 rounded-[20px] bg-[#F5F0EA] p-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1 rounded-[14px] px-1.5 sm:px-2.5 py-1.5 text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-white text-[#333333] shadow-sm border border-[#E5E5E5]"
                        : "text-[#333333] hover:bg-white/40",
                    )}
                  >
                    <span className="truncate">{t(tab.label)}</span>
                    <span
                      className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#DCDCDC] text-[10px] font-bold text-[#595959]"
                    >
                      {counts[tab.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal Separator */}
          <div className="w-full border-t border-[#CACBD4]" />

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-4 py-12 text-center text-[14px] text-[#8B8B8B]">
                {t("No notifications")}
              </p>
            ) : (
              visible.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClosePanel={() => onOpenChange(false)}
                  onAccept={(id) => {
                    const n = notifications.find((item) => item.id === id);
                    if (n) handleOpenOrderDetails(n);
                  }}
                  onDecline={(id) => removeOne(id)}
                  onResolve={(id) => resolve(id)}
                  onClick={(id) => {
                    const n = notifications.find((item) => item.id === id);
                    if (n) {
                      markOneAsRead(id);
                      if (n.category === "orders" || n.orderId) {
                        handleOpenOrderDetails(n);
                      }
                    }
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E5E5] px-5 py-4 text-center text-[12px] font-normal text-[#8B8B8B]">
            {notifications.length} {t("total")} · {unreadCount} {t("unread")}
          </div>
        </SheetContent>
      </Sheet>

      <OrderDetailsDialog
        open={isOrderDetailsOpen}
        order={selectedOrder}
        onOpenChange={setIsOrderDetailsOpen}
        onOrderUpdated={(updated) => setSelectedOrder(updated)}
      />
    </>
  );
};

export default NotificationsPanel;
