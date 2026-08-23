import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/shared/lib/socket";
import { startLoopingAlert, stopLoopingAlert } from "@/shared/lib/notificationSound";
import { updateOrderStatus } from "../api/ordersApi";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { useTranslation } from "@/shared/i18n/useTranslation";
import IncomingOrderDialog from "./IncomingOrderDialog";

export interface IncomingOrder {
  _id: string;
  orderId: string;
  customer: { name: string; phone?: string; address?: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const mapIncomingOrder = (raw: any): IncomingOrder | null => {
  const id = raw?._id;
  if (!id) return null;
  return {
    _id: id,
    orderId: raw.orderId || String(id).slice(-6).toUpperCase(),
    customer: {
      name: raw.customer?.name || "—",
      phone: raw.customer?.phone,
      address: raw.customer?.address,
    },
    items: (raw.items || []).map((i: any) => ({
      name: i.name || "—",
      quantity: i.quantity || 1,
      price: i.price || 0,
    })),
    total: raw.total || 0,
  };
};

/**
 * Mounted once at the authenticated app shell (AppLayout) so it's always
 * listening regardless of which page is open — a new order placed from the
 * customer app must be caught instantly, not only while the Orders page
 * happens to be mounted.
 */
const IncomingOrderWatcher = () => {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<IncomingOrder[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const current = queue[0] ?? null;
  const soundActiveRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    const handleNewOrder = (raw: any) => {
      if (raw?.source !== "application") return;
      const order = mapIncomingOrder(raw);
      if (!order) return;
      setQueue((prev) => (prev.some((o) => o._id === order._id) ? prev : [...prev, order]));
    };
    socket.on("newOrder", handleNewOrder);
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, []);

  useEffect(() => {
    if (current && !soundActiveRef.current) {
      soundActiveRef.current = true;
      startLoopingAlert();
    } else if (!current && soundActiveRef.current) {
      soundActiveRef.current = false;
      stopLoopingAlert();
    }
  }, [current]);

  useEffect(() => stopLoopingAlert, []);

  const handleConfirm = async () => {
    if (!current || isConfirming) return;
    setIsConfirming(true);
    try {
      await updateOrderStatus(current._id, "confirmed");
      showSuccessToast(t("Order confirmed"));
      setQueue((prev) => prev.filter((o) => o._id !== current._id));
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to confirm order"));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <IncomingOrderDialog order={current} isConfirming={isConfirming} onConfirm={handleConfirm} />
  );
};

export default IncomingOrderWatcher;
