import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/shared/lib/socket";
import { startLoopingAlert, stopLoopingAlert, unlockAudio } from "@/shared/lib/notificationSound";
import { getOrders, updateOrderStatus } from "../api/ordersApi";
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

  // Browsers block audio from starting outside a real user gesture — prime
  // the AudioContext on the very first click/keypress/tap anywhere in the
  // app so it's already unlocked by the time a real order alert fires
  // (calling resume() later, from a socket handler, is too late to count
  // as a gesture in most browsers and silently does nothing).
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  const addToQueue = (order: IncomingOrder | null) => {
    if (!order) return;
    setQueue((prev) => (prev.some((o) => o._id === order._id) ? prev : [...prev, order]));
  };

  // Catch up on any app orders the live socket missed — a page load, a
  // refresh, or a socket reconnect after a dropped connection all leave a
  // window where a real newOrder event could have fired with nobody
  // listening. GET /orders?source=application&status=pending returns
  // exactly the same "still needs staff acknowledgment" set a live event
  // represents, so seed the queue with it up front and again on reconnect.
  const fetchPendingAppOrders = () => {
    getOrders({ source: "application", status: "pending", limit: 50 })
      .then((res: any) => {
        const raw: any[] = res?.data ?? res?.orders ?? [];
        raw.forEach((o) => addToQueue(mapIncomingOrder(o)));
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPendingAppOrders();
    const socket = getSocket();
    const handleNewOrder = (raw: any) => {
      if (raw?.source !== "application") return;
      addToQueue(mapIncomingOrder(raw));
    };
    socket.on("newOrder", handleNewOrder);
    socket.on("connect", fetchPendingAppOrders);
    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("connect", fetchPendingAppOrders);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
