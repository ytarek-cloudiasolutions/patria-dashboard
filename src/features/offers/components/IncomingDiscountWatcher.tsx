import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/features/auth/store/authSelectors";
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "../api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
import {
  subscribeDiscountEvents,
  broadcastDiscountEvent,
} from "@/features/offers/utils/discountSocketBus";
import { playNotificationSound, unlockAudio } from "@/shared/lib/notificationSound";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { useTranslation } from "@/shared/i18n/useTranslation";
import DiscountApprovalRequestDialog from "@/features/pos/components/DiscountApprovalRequestDialog";
import type { DiscountOfferItem } from "@/features/pos/components/SelectDiscountOfferDialog";

/**
 * Global Real-Time Watcher for Admin, Manager, and Super Admin.
 * Keeps WebSockets open 24/7. Whether the user is inside POS or anywhere else in the app,
 * new incoming discount requests trigger the Approval Request modal for the latest request.
 */
const IncomingDiscountWatcher = () => {
  const { t } = useTranslation();
  const userRole = useSelector(selectUserRole);
  const normalizedRole = userRole ? userRole.toLowerCase().replace(/[^a-z]/g, "") : "";
  const canApproveOrReject =
    normalizedRole === "admin" ||
    normalizedRole === "manager" ||
    normalizedRole === "superadmin";

  const [pendingQueue, setPendingQueue] = useState<DiscountApprovalRequestItem[]>([]);
  const [currentRequest, setCurrentRequest] = useState<DiscountApprovalRequestItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const processedIdsRef = useRef<Set<string>>(new Set());

  // Unlock AudioContext on initial user gesture
  useEffect(() => {
    if (!canApproveOrReject) return;
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
  }, [canApproveOrReject]);

  const fetchPendingRequests = useCallback(async () => {
    if (!canApproveOrReject) return;
    try {
      const data = await cashierDiscountsApi.getDiscountRequests("pending");
      if (Array.isArray(data)) {
        // Filter out requests already processed/handled in this session
        const fresh = data.filter((r) => {
          const id = r._id || r.id;
          return id && !processedIdsRef.current.has(id);
        });
        setPendingQueue(fresh);
      }
    } catch (err) {
      // Ignore background fetch errors
    }
  }, [canApproveOrReject]);

  // Handle changes in pending queue -> present the latest request
  useEffect(() => {
    if (!canApproveOrReject) return;

    if (pendingQueue.length > 0) {
      const latest = pendingQueue[0];
      const latestId = latest._id || latest.id;
      const currentId = currentRequest?._id || currentRequest?.id;

      if (latestId && latestId !== currentId) {
        setCurrentRequest(latest);
        setIsDialogOpen(true);
        playNotificationSound();
      }
    } else if (!isLoading) {
      setCurrentRequest(null);
      setIsDialogOpen(false);
    }
  }, [pendingQueue, canApproveOrReject, currentRequest, isLoading]);

  // Main Real-Time Listener Effect (Sockets + BroadcastChannel)
  useEffect(() => {
    if (!canApproveOrReject) return;

    fetchPendingRequests();

    const unsubscribe = subscribeDiscountEvents((eventName, payload) => {
      if (payload) {
        const item = payload.request || payload.data || payload;
        const targetId = item?._id || item?.id;
        const status = item?.status || "pending";

        if (targetId && status === "pending" && !processedIdsRef.current.has(targetId)) {
          setPendingQueue((prev) => {
            const exists = prev.some((r) => (r._id || r.id) === targetId);
            if (!exists) {
              return [item, ...prev];
            }
            return prev;
          });
          playNotificationSound();
          return;
        } else if (targetId && status !== "pending") {
          setPendingQueue((prev) => prev.filter((r) => (r._id || r.id) !== targetId));
          return;
        }
      }
      fetchPendingRequests();
    });

    const socket = getSocket();
    socket.on("connect", fetchPendingRequests);

    return () => {
      unsubscribe();
      socket.off("connect", fetchPendingRequests);
    };
  }, [canApproveOrReject, fetchPendingRequests]);

  if (!canApproveOrReject || !currentRequest) {
    return null;
  }

  const reqId = currentRequest._id || currentRequest.id || "";
  const roleName =
    currentRequest.requestedBy?.role || currentRequest.requestedBy?.name || "Super Admin";

  const discountName =
    currentRequest.discountName || currentRequest.discount?.name || "Discount";
  const discountValue =
    currentRequest.discountValue ?? currentRequest.discount?.value ?? 0;
  const discountId =
    currentRequest.discountId ||
    currentRequest.discount?._id ||
    currentRequest.discount?.id ||
    "";

  const offer: DiscountOfferItem = {
    id: discountId,
    name: discountName,
    value: discountValue,
    requiresApproval: true,
    requestedByName: currentRequest.requestedBy?.name,
    requestedByRole: roleName,
  };

  const handleApprove = async () => {
    if (!reqId || isLoading) return;
    setIsLoading(true);
    try {
      await cashierDiscountsApi.approveDiscountRequest(reqId);
      showSuccessToast(t("Discount request approved and applied"));
      if (reqId) processedIdsRef.current.add(reqId);

      broadcastDiscountEvent("discount_request_approved", {
        request: { _id: reqId, id: reqId, status: "approved" },
        status: "approved",
        id: reqId,
      });

      // Advance to next request in queue
      setPendingQueue((prev) => prev.filter((r) => (r._id || r.id) !== reqId));
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message || t("Failed to approve discount request")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reqId || isLoading) return;
    setIsLoading(true);
    try {
      await cashierDiscountsApi.rejectDiscountRequest(reqId);
      showErrorToast(t("Approval request rejected"));
      if (reqId) processedIdsRef.current.add(reqId);

      broadcastDiscountEvent("discount_request_rejected", {
        request: { _id: reqId, id: reqId, status: "rejected" },
        status: "rejected",
        id: reqId,
      });

      // Advance to next request in queue
      setPendingQueue((prev) => prev.filter((r) => (r._id || r.id) !== reqId));
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message || t("Failed to reject discount request")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && reqId) {
      processedIdsRef.current.add(reqId);
      setPendingQueue((prev) => prev.filter((r) => (r._id || r.id) !== reqId));
    }
  };

  return (
    <DiscountApprovalRequestDialog
      open={isDialogOpen}
      offer={offer}
      isLoading={isLoading}
      onOpenChange={handleOpenChange}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};

export default IncomingDiscountWatcher;
