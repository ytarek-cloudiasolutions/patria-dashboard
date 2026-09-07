import { useEffect, useState, useCallback, useRef } from "react";
import { ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "@/features/offers/api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
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
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<DiscountApprovalRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const prevCountRef = useRef<number | null>(null);

  // Unlock AudioContext on initial gesture so sound plays reliably
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

  const fetchRequests = useCallback(async () => {
    try {
      const data = await cashierDiscountsApi.getDiscountRequests("pending");
      setRequests(data);
    } catch (err: any) {
      console.error("Failed to fetch pending discount requests:", err);
    }
  }, []);

  // Play sound chime when a new request arrives
  useEffect(() => {
    if (prevCountRef.current !== null && requests.length > prevCountRef.current) {
      playNotificationSound();
    }
    prevCountRef.current = requests.length;
  }, [requests.length]);

  // Auto-open dropdown whenever there are pending approvals, auto-close when empty
  useEffect(() => {
    if (requests.length > 0) {
      setIsOpen(true);
      const timer = setTimeout(() => {
        updatePopoverPos();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [requests.length]);

  // Recalculate popover position on window resize when open
  useEffect(() => {
    if (!isOpen) return;
    updatePopoverPos();
    window.addEventListener("resize", updatePopoverPos);
    return () => window.removeEventListener("resize", updatePopoverPos);
  }, [isOpen]);

  // Fetch on mount, listen to WebSocket events for instant updates, and poll as backup
  useEffect(() => {
    fetchRequests();

    const socket = getSocket();
    const events = [
      "discount_request_created",
      "discount_request_updated",
      "discount_request_approved",
      "discount_request_rejected",
      "discount_request_cancelled",
      "discountRequestCreated",
      "discountRequestUpdated",
      "discountRequestApproved",
      "discountRequestRejected",
      "discountRequestCancelled",
      "cashier_discount_request",
      "cashierDiscountRequest",
    ];

    const handleSocketUpdate = (payload?: any) => {
      if (payload) {
        const item = payload.request || payload.data || payload;
        const targetId = item?._id || item?.id;
        const status = item?.status;

        if (targetId && status) {
          if (status !== "pending") {
            // Immediately remove from pending list in memory for zero-latency UI update
            setRequests((prev) =>
              prev.filter((r) => r._id !== targetId && r.id !== targetId)
            );
          } else if (item.discount || item.requestedBy) {
            // Add new request in memory instantly and play notification sound chime
            playNotificationSound();
            setRequests((prev) => {
              const exists = prev.some(
                (r) => r._id === targetId || r.id === targetId
              );
              if (!exists) {
                return [item, ...prev];
              }
              return prev;
            });
          }
        }
      }
      fetchRequests();
    };

    events.forEach((evt) => {
      socket.on(evt, handleSocketUpdate);
    });
    socket.on("connect", fetchRequests);

    const interval = setInterval(() => {
      fetchRequests();
    }, 2000);

    return () => {
      events.forEach((evt) => {
        socket.off(evt, handleSocketUpdate);
      });
      socket.off("connect", fetchRequests);
      clearInterval(interval);
    };
  }, [fetchRequests]);

  const handleApprove = async (item: DiscountApprovalRequestItem) => {
    const id = item._id || item.id;
    if (!id) return;
    setActionLoadingId(id);
    try {
      await cashierDiscountsApi.approveDiscountRequest(id);
      showSuccessToast(t("Discount request approved and applied"));
      await fetchRequests();
      if (onApproveSuccess) onApproveSuccess();
    } catch (err: any) {
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
    try {
      await cashierDiscountsApi.rejectDiscountRequest(id);
      showErrorToast(t("Approval request rejected"));
      await fetchRequests();
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message || t("Failed to reject discount request")
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ bottom: number; left: number }>({ bottom: 80, left: 14 });

  const updatePopoverPos = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverPos({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen) {
      updatePopoverPos();
    }
    setIsOpen((prev) => !prev);
  };

  const count = requests.length;

  return (
    <div className={cn("relative w-full flex flex-col", className)}>
      {/* Dark Backdrop Overlay & Expanded Card (Figma Popover Design) */}
      {isOpen && (
        <>
          {/* Dark Semi-transparent Backdrop Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/40 transition-opacity animate-in fade-in-0 duration-150"
          />

          {/* Floating Expanded Popover Card (Figma .frame-2147224160) */}
          <div
            style={{
              position: "fixed",
              bottom: `${popoverPos.bottom}px`,
              left: `${popoverPos.left}px`,
            }}
            className="z-[9999] w-[368px] max-w-[calc(100vw-2rem)] bg-white border-2 border-[#8F6900] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[520px] animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Top Header Inside Card (.frame-2147224159) */}
            <div
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#F5F0EA] px-4 py-3 flex items-center justify-between cursor-pointer select-none rounded-t-[16px]"
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

            {/* Content List (.frame-2147224160_01) */}
            <div className="px-3 py-4 bg-white flex flex-col gap-4 overflow-y-auto max-h-[440px]">
              {requests.length === 0 ? (
                <div className="py-6 text-center text-[13px] text-[#8B8B8B] font-medium leading-[24px]">
                  {t("No pending discount requests.")}
                </div>
              ) : (
                requests.map((item, index) => {
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

                      {/* Actions (.frame-2147224158) */}
                      <div className="flex items-center gap-[14px] h-[40px] w-full">
                        <Button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleReject(item)}
                          className="flex-1 h-[40px] px-6 py-3 bg-[#C90000] text-white font-semibold text-[12px] leading-[24px] rounded-[5px] cursor-pointer disabled:opacity-60"
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
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Trigger Bar */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className="flex h-[44px] w-full items-center justify-between gap-1.5 rounded-[12px] border-2 border-[#8F6900] bg-[#F5F0EA] px-2.5 transition-all cursor-pointer select-none"
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

        {isOpen ? (
          <ChevronDown className="size-4 shrink-0 text-[#8F6900]" />
        ) : (
          <ChevronUp className="size-4 shrink-0 text-[#8F6900]" />
        )}
      </button>
    </div>
  );
};

export default PendingApprovalsWidget;
