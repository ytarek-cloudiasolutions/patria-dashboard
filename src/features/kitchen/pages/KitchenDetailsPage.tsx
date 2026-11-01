import { useEffect, useCallback, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight, RefreshCw, Loader2, Smartphone, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { useKitchen } from "../hooks/useKitchen";
import type { KitchenOrder } from "../store/kitchenTypes";
import { getKitchenStations } from "../api/kitchenApi";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Clock3, UserRound } from "lucide-react";
import { getSocket } from "@/shared/lib/socket";
import { playNotificationSound } from "@/shared/lib/notificationSound";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import { formatTimeAgo } from "@/shared/utils/dateUtils";
import { printKitchenOrderReceipt } from "../utils/printReceipt";
import { formatKitchenOrderId } from "../utils/orderUtils";

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
  // Order.type is stored as "dine_in" (underscore) — createOrder always
  // normalizes any "dine-in" input to this before saving. Keying this map
  // on the hyphen variant meant every dine-in order fell through to the
  // generic fallback style below and showed the raw "dine_in" as its label.
  dine_in: { bg: "#E2F4ED", text: "#059B5A", border: "#059B5A", label: "Dine-In" },
  pos: { bg: "#E2F4ED", text: "#059B5A", border: "#059B5A", label: "Dine-In" },
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

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange: (id: string, status: string) => void;
  stationColor: string;
  onCardClick: (order: KitchenOrder) => void;
  onPrint?: (order: KitchenOrder) => void;
}

const ApiKitchenOrderCard = ({ order, onStatusChange, stationColor, onCardClick, onPrint }: OrderCardProps) => {
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
  const typeKey = (order.type ?? "dine_in").toLowerCase();
  const typeStyle = ORDER_TYPE_STYLE[typeKey] ?? {
    bg: "#EDF4FB",
    text: "#3574FF",
    border: "#3574FF",
    label: order.type ?? "Delivery"
  };

  const items = order.items ?? [];
  const hasMore = items.length > 2;
  const displayedItems = hasMore ? items.slice(0, 2) : items;
  const remainingCount = items.length - 2;

  return (
    <Card
      onClick={() => onCardClick(order)}
      className="flex flex-col h-full rounded-2xl border border-[#E7E7EC] bg-white p-5 ring-0 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#8F6900]/30 hover:-translate-y-0.5"
    >
      <CardContent className="flex flex-col flex-1 px-0 py-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-bold text-[#333333]">
            {formatKitchenOrderId(order)}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrint?.(order);
              }}
              title={t("Print Kitchen Receipt")}
              aria-label={t("Print Kitchen Receipt")}
              className="group/print flex cursor-pointer items-center justify-center gap-3 px-2.5 py-1.5 rounded-[8px] border border-[#FAFAF7] bg-[#F5F0EA] text-[#8F6900] transition-all duration-150 hover:bg-[#ebdcc8] active:scale-95"
            >
              <Printer className="size-3.5 text-[#8F6900] transition-transform duration-200 group-hover/print:scale-110" />
            </button>
            <Badge
              className="rounded-[30px] border px-3 py-1 text-[12px] font-normal"
              style={{ backgroundColor: typeStyle.bg, color: typeStyle.text, borderColor: typeStyle.border }}
            >
              {t(typeStyle.label)}
            </Badge>
          </div>
        </div>

        <div className="mb-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-2 text-[12px] text-[#595959] space-y-2">
          <div className="flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {t("Received")} {formatTimeAgo(order.createdAt, t)}
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

        <ul className={cn("space-y-1 list-disc pl-5 pr-2 text-[13px] font-medium text-black", !hasMore && "mb-4")}>
          {displayedItems.map((item, idx) => {
            const productName = typeof item.productId === "object" ? item.productId?.name : undefined;
            return (
              <li key={idx} className="marker:text-black">
                {item.quantity}x {item.name || productName || t("Item")}
                {item.notes && <span className="ml-1 text-[11px] text-[#8B8B8B]">({item.notes})</span>}
              </li>
            );
          })}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(order);
            }}
            className="mt-2.5 mb-4 w-full rounded-full border border-[#8F6900] bg-white py-1.5 px-4 text-center text-[13px] font-semibold text-[#8F6900] transition-all duration-150 hover:bg-[#F5F0EA] active:scale-[0.98] cursor-pointer"
          >
            {remainingCount === 1
              ? t("View 1 more item")
              : t("View {count} more items").replace("{count}", String(remainingCount))}
          </button>
        )}

        {next && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order._id, next);
            }}
            className="mt-auto w-full rounded-[8px] py-2 text-[13px] font-semibold text-white transition-all duration-150 mb-3 cursor-pointer hover:opacity-90 hover:shadow-xs active:scale-[0.98]"
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
  const [stationStatus, setStationStatus] = useState<string>("Active");

  const station = kitchenId ? KITCHEN_STATIONS[kitchenId] : null;

  const fetchOrders = useCallback(() => {
    if (kitchenId) getKitchenOrders(kitchenId);
  }, [kitchenId, getKitchenOrders]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    const fetchStationStatus = async () => {
      try {
        const stations = await getKitchenStations();
        const currentStation = stations.find((s) => s.kitchenType === kitchenId);
        if (currentStation?.status) {
          setStationStatus(currentStation.status);
        }
      } catch (err) {
        console.error("Failed to fetch station status", err);
      }
    };
    if (kitchenId) fetchStationStatus();
  }, [kitchenId]);

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
        <Button
          onClick={() => navigate("/kitchen")}
          className="group transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
        >
          {dir === "rtl" ? (
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          ) : (
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
          {t("Back to Kitchens")}
        </Button>
      </div>
    );
  }

  const isBusy = stationStatus?.toLowerCase() === "busy";
  const badgeText = isBusy ? "Busy" : "Active";
  const badgeClasses = isBusy
    ? "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]"
    : "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]";

  return (
    <section className="animate-in fade-in-50 duration-300">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Button
            size="icon"
            variant="ghost"
            className="group/back size-12 rounded-2xl bg-white cursor-pointer hover:bg-white hover:shadow-xs active:scale-95 transition-all duration-200"
            onClick={() => navigate("/kitchen")}
          >
            {dir === "rtl" ? (
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/back:translate-x-0.5" />
            ) : (
              <ArrowLeft className="size-5 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
            )}
          </Button>

          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-full text-[18px] font-bold"
              style={{ backgroundColor: station.bg, color: station.color }}
            >
              {station.name[0]}
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[24px] font-bold text-black">{t(station.name)}</h1>
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-[13px] font-medium leading-none transition-colors",
                  badgeClasses
                )}
              >
                {t(badgeText)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Summary Metrics */}
          <div className="flex items-center gap-5 text-center">
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[#333333] leading-none">
                {kitchenOrders.length}
              </span>
              <span className="mt-1 text-[12px] font-medium text-[#8B8B8B]">
                {t("Active Orders")}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="group/refresh flex items-center gap-2 border-[#E5E5E5] h-12 px-4 rounded-[8px] cursor-pointer transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
            onClick={fetchOrders}
            disabled={loading.fetch}
          >
            <RefreshCw className={`size-4 transition-transform duration-300 ${loading.fetch ? "animate-spin" : "group-hover/refresh:rotate-180"}`} />
            {t("Refresh")}
          </Button>
        </div>
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
              onPrint={(ord) => printKitchenOrderReceipt(ord, station.name)}
            />
          ))}
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        stationName={station.name}
      />
    </section>
  );
};

export default KitchenDetailsPage;
