import { useEffect, useCallback, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useKitchen } from "../hooks/useKitchen";
import type { KitchenOrder } from "../store/kitchenTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Clock3, UserRound, Smartphone } from "lucide-react";
import { getSocket } from "@/shared/lib/socket";
import { playNotificationSound } from "@/shared/lib/notificationSound";
import OrderDetailsDialog from "../components/OrderDetailsDialog";

const KITCHEN_STATIONS: Record<string, { name: string; color: string; bg: string }> = {
  barista: { name: "Barista", color: "#F9A825", bg: "#FE9A001A" },
  pastry: { name: "Pastry & Bakery", color: "#A856F7", bg: "#F3E9FA" },
  hot_food: { name: "Hot Food", color: "#E53935", bg: "#FEECEC" },
};

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending:   { bg: "#F5F0EA", text: "#624F1C", border: "#C8A96E", label: "Pending" },
  confirmed: { bg: "#E8F4FD", text: "#1565C0", border: "#1565C0", label: "Confirmed" },
  preparing: { bg: "#FE9A001A", text: "#C7861E", border: "#C7861E", label: "Preparing" },
  ready:     { bg: "#E2F4ED", text: "#059B5A", border: "#059B5A", label: "Ready" },
  served:    { bg: "#F0F0F0", text: "#666666", border: "#999999", label: "Served" },
};

const ORDER_TYPE_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  delivery: { bg: "#EDF4FB", text: "#3574FF", border: "#3574FF", label: "Delivery" },
  takeaway: { bg: "#F5F0EA", text: "#8F6900", border: "#C8A96E", label: "Takeaway" },
  "dine-in": { bg: "#E2F4ED", text: "#059B5A", border: "#059B5A", label: "Dine-In" },
};

function formatTimeAgo(createdAt: string): string {
  const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff === 1) return "1 min ago";
  return `${diff} mins ago`;
}

function getCustomerName(order: KitchenOrder): string {
  if (!order.customer) return "Walk-in";
  if (typeof order.customer === "string") return order.customer;
  return order.customer.name ?? "Walk-in";
}

function getCustomerPhone(order: KitchenOrder): string {
  if (!order.customer || typeof order.customer === "string") return "";
  return order.customer.phone ?? "";
}

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange: (id: string, status: string) => void;
  stationColor: string;
  onCardClick: (order: KitchenOrder) => void;
}

const ApiKitchenOrderCard = ({ order, onStatusChange, stationColor, onCardClick }: OrderCardProps) => {
  const { t } = useTranslation();
  const statusStyle = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
  const nextStatus: Record<string, string> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "served",
  };
  const next = nextStatus[order.status];

  // Get order type style with fallback
  const typeKey = (order.type ?? "dine-in").toLowerCase();
  const typeStyle = ORDER_TYPE_STYLE[typeKey] ?? {
    bg: "#EDF4FB",
    text: "#3574FF",
    border: "#3574FF",
    label: order.type ?? "Delivery"
  };

  return (
    <Card
      onClick={() => onCardClick(order)}
      className="flex flex-col h-full rounded-2xl border border-[#E7E7EC] bg-white p-5 ring-0 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <CardContent className="flex flex-col flex-1 px-0 py-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-bold text-[#333333]">
            {order.orderNumber ?? `#${order._id.slice(-6).toUpperCase()}`}
          </h3>
          <Badge
            className="rounded-[30px] border px-3 py-1 text-[12px] font-normal"
            style={{ backgroundColor: typeStyle.bg, color: typeStyle.text, borderColor: typeStyle.border }}
          >
            {t(typeStyle.label)}
          </Badge>
        </div>

        <div className="mb-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-2 text-[12px] text-[#595959] space-y-2">
          <div className="flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {t("Received")} {formatTimeAgo(order.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <UserRound className="size-3.5" />
            {getCustomerName(order)}
            {order.table && <span className="ml-2 text-[#8B8B8B]">· {t("Table")} {order.table}</span>}
          </div>
          {getCustomerPhone(order) && (
            <div className="flex items-center gap-1">
              <Smartphone className="size-3.5" />
              <span dir="ltr">{getCustomerPhone(order)}</span>
            </div>
          )}
        </div>

        <ul className="mb-4 space-y-1 list-disc pl-5 pr-2 text-[13px] font-medium text-black">
          {order.items.map((item, idx) => (
            <li key={idx} className="marker:text-black">
              {item.quantity}x {item.name}
              {item.notes && <span className="ml-1 text-[11px] text-[#8B8B8B]">({item.notes})</span>}
            </li>
          ))}
        </ul>

        {next && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order._id, next);
            }}
            className="mt-auto w-full rounded-[8px] py-2 text-[13px] font-semibold text-white transition mb-3 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: stationColor }}
          >
            {t(`Mark as ${STATUS_STYLE[next]?.label ?? next}`)}
          </button>
        )}

        <div
          className={`${!next ? "mt-auto" : ""} w-full rounded-[30px] border px-3 py-1.5 text-center text-[12px] font-semibold`}
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
        >
          {t(statusStyle.label)}
        </div>
      </CardContent>
    </Card>
  );
};

const KitchenDetailsPage = () => {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { kitchenId } = useParams<{ kitchenId: string }>();
  const { kitchenOrders, loading, getKitchenOrders, updateOrderStatus } = useKitchen();
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);

  const station = kitchenId ? KITCHEN_STATIONS[kitchenId] : null;

  const fetchOrders = useCallback(() => {
    if (kitchenId) getKitchenOrders(kitchenId);
  }, [kitchenId, getKitchenOrders]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Live updates: play a sound and refresh the board when the kitchen gets a new
  // order or new items are added to an order already sent to this station.
  useEffect(() => {
    const socket = getSocket();
    socket.emit("kitchen:join", {});

    const handleUpdate = () => {
      playNotificationSound();
      fetchOrders();
    };

    socket.on("kitchen:new-order", handleUpdate);
    socket.on("kitchen:items-added", handleUpdate);

    return () => {
      socket.off("kitchen:new-order", handleUpdate);
      socket.off("kitchen:items-added", handleUpdate);
    };
  }, [fetchOrders]);

  if (!station) {
    return (
      <div className="space-y-4">
        <h2 className="text-[28px] font-bold text-[#303030]">{t("Kitchen not found")}</h2>
        <Button onClick={() => navigate("/kitchen")}>
          {dir === "rtl" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          {t("Back to Kitchens")}
        </Button>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Button
            size="icon"
            variant="ghost"
            className="size-12 rounded-2xl bg-white cursor-pointer hover:bg-white"
            onClick={() => navigate("/kitchen")}
          >
            {dir === "rtl" ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
          </Button>

          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-full text-[18px] font-bold"
              style={{ backgroundColor: station.bg, color: station.color }}
            >
              {station.name[0]}
            </div>
            <div>
              <h1 className="text-[24px] font-semibold text-black">{t(station.name)}</h1>
              <p className="text-[13px] text-[#8B8B8B]">
                {kitchenOrders.length} {t("active orders")}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-[#E5E5E5]"
          onClick={fetchOrders}
          disabled={loading.fetch}
        >
          <RefreshCw className={`size-4 ${loading.fetch ? "animate-spin" : ""}`} />
          {t("Refresh")}
        </Button>
      </div>

      <div
        className="mb-7 h-0.75 w-full rounded-full"
        style={{ backgroundColor: station.color }}
      />

      {loading.fetch ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 animate-spin" style={{ color: station.color }} />
        </div>
      ) : kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8B8B8B]">
          <p className="text-[18px] font-medium">{t("No active orders")}</p>
          <p className="mt-1 text-[13px]">{t("Orders assigned to this station will appear here")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {kitchenOrders.map((order) => (
            <ApiKitchenOrderCard
              key={order._id}
              order={order}
              stationColor={station.color}
              onStatusChange={(id, status) =>
                updateOrderStatus(id, { status: status as any })
              }
              onCardClick={(ord) => setSelectedOrder(ord)}
            />
          ))}
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </section>
  );
};

export default KitchenDetailsPage;
