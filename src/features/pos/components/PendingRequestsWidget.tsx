import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/features/auth/store/authSelectors";
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "@/features/offers/api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
import { subscribeDiscountEvents } from "@/features/offers/utils/discountSocketBus";
import { playNotificationSound, unlockAudio } from "@/shared/lib/notificationSound";
import { cn } from "@/lib/utils";

interface PendingRequestsWidgetProps {
  className?: string;
  onSelectOrder?: (orderId: string, item?: DiscountApprovalRequestItem) => void;
}

const PendingRequestsWidget = ({ className, onSelectOrder }: PendingRequestsWidgetProps) => {
  const { t } = useTranslation();
  const userRole = useSelector(selectUserRole);
  const normalizedRole = userRole ? userRole.toLowerCase().replace(/[^a-z]/g, "") : "";
  const isManagerOrAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "manager" ||
    normalizedRole === "superadmin";

  const [requests, setRequests] = useState<DiscountApprovalRequestItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const prevCountRef = useRef<number | null>(null);

  // Audio gesture unlock for notification chimes
  useEffect(() => {
    if (isManagerOrAdmin) return;
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
  }, [isManagerOrAdmin]);

  const fetchRequests = useCallback(async () => {
    if (isManagerOrAdmin) return;
    try {
      const data = await cashierDiscountsApi.getMyDiscountRequests();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch cashier pending requests:", err);
    }
  }, [isManagerOrAdmin]);

  // Real-time sound notification when count increases or status updates
  useEffect(() => {
    if (prevCountRef.current !== null && requests.length > prevCountRef.current) {
      playNotificationSound();
    }
    prevCountRef.current = requests.length;
  }, [requests.length]);

  // Subscribe to discount socket & cross-tab events
  useEffect(() => {
    if (isManagerOrAdmin) return;

    fetchRequests();

    const unsubscribe = subscribeDiscountEvents(() => {
      fetchRequests();
    });

    const socket = getSocket();
    socket.on("connect", fetchRequests);

    return () => {
      unsubscribe();
      socket.off("connect", fetchRequests);
    };
  }, [isManagerOrAdmin, fetchRequests]);

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

  // Close popover if all requests are acknowledged / cleared
  useEffect(() => {
    if (requests.length === 0) {
      setIsOpen(false);
    } else if (isOpen) {
      const timer = setTimeout(updatePopoverPos, 50);
      return () => clearTimeout(timer);
    }
  }, [requests.length, isOpen]);

  // Recalculate popover position on resize
  useEffect(() => {
    if (!isOpen) return;
    updatePopoverPos();
    window.addEventListener("resize", updatePopoverPos);
    return () => window.removeEventListener("resize", updatePopoverPos);
  }, [isOpen]);

  const handleItemClick = (item: DiscountApprovalRequestItem) => {
    const rawOrderId =
      typeof item.orderId === "object"
        ? item.orderId?._id || item.orderId?.id || item.orderId?.orderId
        : item.orderId;
    if (rawOrderId && onSelectOrder) {
      onSelectOrder(String(rawOrderId), item);
      setIsOpen(false);
    }
  };

  const count = requests.length;

  // Only display for cashier roles and when there are active requests
  if (isManagerOrAdmin || count === 0) return null;

  return (
    <div className={cn("relative w-full flex flex-col", className)}>
      {/* Dark Backdrop + Expanded Card (Portal to document.body for flawless stacking) */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Dark Semi-transparent Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-[1px] transition-opacity animate-in fade-in-0 duration-200"
            />

            {/* Floating Expanded Card (Figma .frame-2147224160) */}
            <div
              style={{
                position: "fixed",
                bottom: `${popoverPos.bottom}px`,
                ...(popoverPos.left !== undefined ? { left: `${popoverPos.left}px` } : {}),
                ...(popoverPos.right !== undefined ? { right: `${popoverPos.right}px` } : {}),
              }}
              className="z-[99999] w-[368px] max-w-[calc(100vw-2rem)] bg-white border-2 border-[#8F6900] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[520px] animate-in fade-in-0 zoom-in-95 duration-150"
            >
              {/* Header (.frame-2147224159) */}
              <div
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#F5F0EA] px-4 py-3 flex items-center justify-between cursor-pointer select-none rounded-t-[14px]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="size-4 text-[#8F6900] shrink-0" />
                    <span className="text-[14px] font-semibold text-[#8F6900] leading-[24px]">
                      {t("Pending Requests")}
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
                {requests.map((item, index) => {
                  const reqId = item._id || item.id || String(index);
                  const orderIdDisplay =
                    (typeof item.orderId === "object"
                      ? item.orderId?.orderId || item.orderId?.id || item.orderId?._id
                      : item.orderId) || "#ORD";
                  const formattedOrderId = String(orderIdDisplay).startsWith("#")
                    ? orderIdDisplay
                    : `#${orderIdDisplay}`;
                  const discountVal = item.discountValue ?? item.discount?.value ?? 0;
                  const discountName =
                    item.discountName || item.discount?.name || "Discount";

                  return (
                    <div key={reqId} className="flex flex-col gap-3 w-full">
                      {index > 0 && <div className="w-full border-t border-[#CACBD4]" />}

                      <div
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex flex-col gap-[2px] text-start w-full select-none",
                          onSelectOrder &&
                            "cursor-pointer hover:bg-[#FDFBF7] p-2 -mx-2 rounded-[8px] transition-colors"
                        )}
                      >
                        {/* Order ID with Shopping Bag Icon */}
                        <div className="flex items-center justify-between gap-1 text-[13px] leading-[24px]">
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="size-4 text-[#8F6900] shrink-0" />
                            <span className="font-semibold text-[#8F6900]">
                              {formattedOrderId}
                            </span>
                          </div>

                          {/* Status Badge (if resolved by manager) */}
                          {item.status === "approved" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]">
                              {t("Approved")}
                            </span>
                          )}
                          {item.status === "rejected" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDE8E8] text-[#C90000] border border-[#C90000]">
                              {t("Rejected")}
                            </span>
                          )}
                        </div>

                        {/* Offer Title */}
                        <h5 className="text-[14px] font-bold text-black leading-[24px]">
                          {discountVal}% {t("Discount")} — {discountName}
                        </h5>

                        {/* Subtitle description */}
                        <p className="text-[10px] font-medium text-[#8B8B8B] leading-[24px]">
                          {t("You requested")} {discountVal}% {t("discount")} ({discountName}) — {t("Cashier")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
        )}

      {/* Main Trigger Bar in POS Sidebar */}
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
            {t("Pending Requests")}
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

export default PendingRequestsWidget;
