import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/features/auth/store/authSelectors";
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "@/features/offers/api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
import {
  subscribeDiscountEvents,
  broadcastDiscountEvent,
} from "@/features/offers/utils/discountSocketBus";
import { playNotificationSound, unlockAudio } from "@/shared/lib/notificationSound";
import { cn } from "@/lib/utils";

interface PendingApprovalsWidgetProps {
  className?: string;
  onApproveSuccess?: () => void;
}

const PendingApprovalsWidget = ({
  className,
  onApproveSuccess,
}: PendingApprovalsWidgetProps) => {
  const { t } = useTranslation();
  const userRole = useSelector(selectUserRole);
  const normalizedRole = userRole ? userRole.toLowerCase().replace(/[^a-z]/g, "") : "";
  const canApproveOrReject =
    normalizedRole === "admin" ||
    normalizedRole === "manager" ||
    normalizedRole === "superadmin";


  const [requests, setRequests] = useState<DiscountApprovalRequestItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const prevCountRef = useRef<number | null>(null);

  // ── Dismissed IDs: once a request is approved/rejected, its IDs are permanently blocked ──
  // No socket event, fetchRequests call, or BroadcastChannel message can ever re-add it.
  const dismissedIdsRef = useRef<Set<string>>(new Set());

  const dismissRequest = (item: DiscountApprovalRequestItem) => {
    if (item._id) dismissedIdsRef.current.add(String(item._id));
    if (item.id) dismissedIdsRef.current.add(String(item.id));
  };

  const dismissId = (...ids: (string | undefined | null)[]) => {
    for (const id of ids) {
      if (id) dismissedIdsRef.current.add(String(id));
    }
  };

  const isDismissed = (item: DiscountApprovalRequestItem): boolean => {
    if (item._id && dismissedIdsRef.current.has(String(item._id))) return true;
    if (item.id && dismissedIdsRef.current.has(String(item.id))) return true;
    return false;
  };

  const isIdDismissed = (id: string | undefined | null): boolean => {
    return !!id && dismissedIdsRef.current.has(String(id));
  };

  const undismissRequest = (item: DiscountApprovalRequestItem) => {
    if (item._id) dismissedIdsRef.current.delete(String(item._id));
    if (item.id) dismissedIdsRef.current.delete(String(item.id));
  };

  const undismissId = (...ids: (string | undefined | null)[]) => {
    for (const id of ids) {
      if (id) dismissedIdsRef.current.delete(String(id));
    }
  };

  // Unlock AudioContext on initial gesture so sound plays reliably
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

  const fetchRequests = useCallback(async () => {
    if (!canApproveOrReject) return;
    try {
      const data = await cashierDiscountsApi.getDiscountRequests("pending");
      if (Array.isArray(data)) {
        // Filter out any dismissed IDs so approved/rejected items never reappear
        setRequests(data.filter((r) => !isDismissed(r)));
      }
    } catch (err: any) {
      console.error("Failed to fetch pending discount requests:", err);
    }
  }, [canApproveOrReject]);

  // Play sound chime when a new request arrives
  useEffect(() => {
    if (prevCountRef.current !== null && requests.length > prevCountRef.current) {
      playNotificationSound();
    }
    prevCountRef.current = requests.length;
  }, [requests.length]);



  // Fetch on mount and subscribe to real-time events across sockets and tabs (no periodic HTTP polling)
  useEffect(() => {
    if (!canApproveOrReject) return;

    fetchRequests();

    const unsubscribe = subscribeDiscountEvents((eventName, payload) => {
      if (!payload) return;
      const item = payload.request || payload.data || payload;
      const targetId = item?._id || item?.id || payload?._id || payload?.id;
      const status = item?.status || payload?.status;

      if (!targetId) return;

      // If this ID has been dismissed (approved/rejected by us), ignore ALL events for it
      if (isIdDismissed(targetId) || isIdDismissed(item?._id) || isIdDismissed(item?.id)) {
        // Still remove from state in case it snuck in somehow
        setRequests((prev) => prev.filter((r) => !isDismissed(r)));
        return;
      }

      const evtLower = eventName.toLowerCase();
      const isFinished =
        status === "approved" ||
        status === "rejected" ||
        status === "cancelled" ||
        evtLower.includes("approved") ||
        evtLower.includes("rejected") ||
        evtLower.includes("cancelled");

      if (isFinished || (status && status !== "pending")) {
        // Mark as dismissed and remove from state
        dismissId(targetId, item?._id, item?.id);
        setRequests((prev) => prev.filter((r) => !isDismissed(r)));
      } else if (status === "pending" || (!status && (evtLower.includes("created")))) {
        // New pending request arrived — fetch full data from API instead of inserting
        // the raw socket payload (which is often missing discountName, discountValue, etc.)
        fetchRequests();
      }
    });

    const socket = getSocket();
    socket.on("connect", fetchRequests);

    return () => {
      unsubscribe();
      socket.off("connect", fetchRequests);
    };
  }, [canApproveOrReject, fetchRequests]);

  const handleApprove = async (item: DiscountApprovalRequestItem) => {
    const id = item._id || item.id;
    if (!id) return;
    setActionLoadingId(id);

    // 1. Permanently dismiss this request — blocks ALL future re-additions from any source
    dismissRequest(item);
    dismissId(id);

    // 2. Optimistically remove from state immediately
    setRequests((prev) => prev.filter((r) => !isDismissed(r)));

    try {
      await cashierDiscountsApi.approveDiscountRequest(id);
      showSuccessToast(t("Discount request approved and applied"));

      broadcastDiscountEvent("discount_request_approved", {
        request: { _id: item._id || id, id: item.id || id, status: "approved" },
        status: "approved",
        id: item._id || id,
      });

      if (onApproveSuccess) onApproveSuccess();
    } catch (err: any) {
      const errStatus = err?.response?.status;
      // Only restore on true server errors (not 404/400/409/422 which mean already processed)
      if (
        errStatus !== 404 &&
        errStatus !== 400 &&
        errStatus !== 409 &&
        errStatus !== 422
      ) {
        // Undo dismissal and restore
        undismissRequest(item);
        undismissId(id);
        setRequests((prev) => {
          const exists = prev.some((r) => String(r._id || r.id) === String(id));
          return exists ? prev : [item, ...prev];
        });
      }
      showErrorToast(
        err?.response?.data?.message || t("Failed to approve discount request")
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (item: DiscountApprovalRequestItem) => {
    const id = item._id || item.id;
    if (!id) return;
    setActionLoadingId(id);

    // 1. Permanently dismiss this request — blocks ALL future re-additions from any source
    dismissRequest(item);
    dismissId(id);

    // 2. Optimistically remove from state immediately
    setRequests((prev) => prev.filter((r) => !isDismissed(r)));

    try {
      await cashierDiscountsApi.rejectDiscountRequest(id);
      showErrorToast(t("Approval request rejected"));

      broadcastDiscountEvent("discount_request_rejected", {
        request: { _id: item._id || id, id: item.id || id, status: "rejected" },
        status: "rejected",
        id: item._id || id,
      });
    } catch (err: any) {
      const errStatus = err?.response?.status;
      // Only restore on true server errors (not 404/400/409/422 which mean already processed)
      if (
        errStatus !== 404 &&
        errStatus !== 400 &&
        errStatus !== 409 &&
        errStatus !== 422
      ) {
        // Undo dismissal and restore
        undismissRequest(item);
        undismissId(id);
        setRequests((prev) => {
          const exists = prev.some((r) => String(r._id || r.id) === String(id));
          return exists ? prev : [item, ...prev];
        });
      }
      showErrorToast(
        err?.response?.data?.message || t("Failed to reject discount request")
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{
    bottom: number;
    left?: number;
    right?: number;
  }>({ bottom: 80, left: 14 });

  const updatePopoverPos = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isRtl = document.documentElement.dir === "rtl";
      const bottom = Math.max(8, window.innerHeight - rect.bottom);
      if (isRtl) {
        setPopoverPos({
          bottom,
          right: Math.max(8, window.innerWidth - rect.right),
        });
      } else {
        setPopoverPos({
          bottom,
          left: Math.max(8, rect.left),
        });
      }
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen) {
      updatePopoverPos();
    }
    setIsOpen((prev) => !prev);
  };

  // Close popover if all requests are resolved / cleared
  useEffect(() => {
    if (requests.length === 0) {
      setIsOpen(false);
    } else if (isOpen) {
      const timer = setTimeout(updatePopoverPos, 50);
      return () => clearTimeout(timer);
    }
  }, [requests.length, isOpen]);

  // Recalculate popover position on window resize
  useEffect(() => {
    if (!isOpen) return;
    updatePopoverPos();
    window.addEventListener("resize", updatePopoverPos);
    return () => window.removeEventListener("resize", updatePopoverPos);
  }, [isOpen]);

  const count = requests.length;

  if (!canApproveOrReject || count === 0) return null;

  return (
    <div className={cn("relative w-full flex flex-col", className)}>
      {/* Dark Backdrop + Expanded Card (Portal to document.body for proper stacking) */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Dark Semi-transparent Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-[1px] transition-opacity animate-in fade-in-0 duration-200"
            />

            {/* Floating Expanded Card */}
            <div
              style={{
                position: "fixed",
                bottom: `${popoverPos.bottom}px`,
                ...(popoverPos.left !== undefined ? { left: `${popoverPos.left}px` } : {}),
                ...(popoverPos.right !== undefined ? { right: `${popoverPos.right}px` } : {}),
              }}
              className="z-[99999] w-[368px] max-w-[calc(100vw-2rem)] bg-white border-2 border-[#8F6900] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[520px] animate-in fade-in-0 zoom-in-95 duration-150"
            >
              {/* Header */}
              <div
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#F5F0EA] px-4 py-3 flex items-center justify-between cursor-pointer select-none rounded-t-[14px]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="size-4 text-[#8F6900] shrink-0" />
                    <span className="text-[14px] font-semibold text-[#8F6900] leading-[24px]">
                      {t("Pending Approvals")}
                    </span>
                  </div>
                  <div className="size-6 rounded-[50px] bg-[#8F6900] text-white text-[12px] font-bold tracking-[0.24px] flex items-center justify-center shrink-0">
                    {count}
                  </div>
                </div>
                <ChevronDown className="size-6 text-black shrink-0" />
              </div>

              {/* Content List */}
              <div className="px-3 py-4 bg-white flex flex-col gap-4 overflow-y-auto max-h-[440px]">
                {requests.map((item, index) => {
                  const reqId = item._id || item.id || String(index);
                  const roleName =
                    item.requestedBy?.role || item.requestedBy?.name || "Super Admin";
                  const presetName =
                    item.discountName || item.discount?.name || "Discount";
                  const discountVal =
                    item.discountValue ?? item.discount?.value ?? 0;
                  const isItemLoading = actionLoadingId === reqId;

                  return (
                    <div key={reqId} className="flex flex-col gap-3 w-full">
                      {index > 0 && (
                        <div className="w-full border-t border-[#CACBD4]" />
                      )}

                      <div className="flex flex-col gap-[2px] text-start w-full">
                        {/* Role Header */}
                        <div className="flex items-center gap-1 text-[13px] text-black leading-[24px]">
                          <ShieldCheck className="size-4 text-[#8F6900] shrink-0" />
                          <span className="font-medium text-black">
                            {t("Request from")}{" "}
                            <span className="font-semibold text-[#8F6900]">
                              {roleName}
                            </span>
                          </span>
                        </div>

                        {/* Offer Title */}
                        <h5 className="text-[14px] font-bold text-black leading-[24px]">
                          {discountVal}% {t("Discount")} — {presetName}
                        </h5>

                        {/* Sub description */}
                        <p className="text-[10px] font-medium text-[#8B8B8B] leading-[24px]">
                          {item.requestedBy?.name || roleName} {t("requested")} {discountVal}%{" "}
                          {t("discount")} ({presetName}) — {t("Cashier")}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-[14px] h-[40px] w-full">
                        <Button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleReject(item)}
                          className="flex-1 h-[40px] px-6 py-3 bg-[#C90000] border-0 outline-none text-white font-semibold text-[12px] leading-[24px] rounded-[5px] cursor-pointer disabled:opacity-60 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                        >
                          {t("Reject")}
                        </Button>
                        <Button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleApprove(item)}
                          className="flex-1 h-[40px] px-6 py-3 bg-[#E2F4ED] border border-[#059B5A] text-[#059B5A] font-semibold text-[12px] leading-[24px] rounded-[5px] cursor-pointer disabled:opacity-60"
                        >
                          {t("Approve")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
        )}

      {/* Trigger Bar (in sidebar flow; invisible when open so only the expanded card is visible) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "flex h-[44px] w-full items-center justify-between gap-1.5 rounded-[12px] border-2 border-[#8F6900] bg-[#F5F0EA] px-2.5 transition-all cursor-pointer select-none",
          isOpen && "invisible pointer-events-none"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldCheck className="size-5 text-[#8F6900] shrink-0" />
          <span className="whitespace-nowrap text-[12px] font-semibold leading-6 text-[#8F6900]">
            {t("Pending Approvals")}
          </span>
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[11px] font-bold text-white">
            {count}
          </div>
        </div>

        <ChevronUp className="size-4 shrink-0 text-[#8F6900]" />
      </button>
    </div>
  );
};

export default PendingApprovalsWidget;
