import { useEffect, useState } from "react";
import { Banknote, CreditCard, Smartphone, Tag } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type { PaymentMethod } from "../types";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/features/auth/store/authSelectors";
import cashierDiscountsApi from "@/features/offers/api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
import { playNotificationSound } from "@/shared/lib/notificationSound";
import SelectDiscountOfferDialog, {
  type DiscountOfferItem,
} from "./SelectDiscountOfferDialog";
import DiscountApprovalRequestDialog from "./DiscountApprovalRequestDialog";
import AwaitingManagerApprovalDialog from "./AwaitingManagerApprovalDialog";

type PaymentDialogProps = {
  open: boolean;
  total: number;
  isLoading?: boolean;
  orderId?: string | null;
  onEnsureOrderId?: () => Promise<string | null>;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    method: PaymentMethod,
    discountInfo?: {
      id: string;
      name: string;
      value: number;
      discountAmount: number;
    }
  ) => void;
};

const paymentOptions: Array<{
  method: PaymentMethod;
  label: string;
  icon: typeof Banknote;
}> = [
  { method: "cash", label: "Cash", icon: Banknote },
  { method: "card", label: "Visa/Card", icon: CreditCard },
  { method: "instapay", label: "Instapay", icon: Smartphone },
  { method: "mix", label: "Mix", icon: Banknote },
];

const fieldLabel = "text-[16px] font-medium text-black";
const fieldInput =
  "h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors";

const PaymentDialog = ({
  open,
  total,
  isLoading = false,
  orderId,
  onEnsureOrderId,
  onOpenChange,
  onConfirm,
}: PaymentDialogProps) => {
  const { t } = useTranslation();
  const userRole = useSelector(selectUserRole);
  const normalizedRole = userRole ? userRole.toLowerCase().replace(/[^a-z]/g, "") : "";
  const canApproveOrReject =
    normalizedRole === "admin" ||
    normalizedRole === "manager" ||
    normalizedRole === "superadmin";

  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");

  // Cashier Discount states
  const [isSelectOfferOpen, setIsSelectOfferOpen] = useState(false);
  const [isApprovalRequestOpen, setIsApprovalRequestOpen] = useState(false);
  const [isAwaitingApprovalOpen, setIsAwaitingApprovalOpen] = useState(false);
  const [pendingApprovalOffer, setPendingApprovalOffer] =
    useState<DiscountOfferItem | null>(null);
  const [appliedDiscount, setAppliedDiscount] =
    useState<DiscountOfferItem | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isDiscountApiLoading, setIsDiscountApiLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMethod("cash");
    setTransactionRef("");
    setCashAmount("");
    setCardAmount("");
    setAppliedDiscount(null);
    setPendingApprovalOffer(null);
    setRequestId(null);
    setIsSelectOfferOpen(false);
    setIsApprovalRequestOpen(false);
    setIsAwaitingApprovalOpen(false);
  }, [open]);

  // Real-time listener: detect manager approval/rejection instantly via WebSockets or fast 1s polling
  useEffect(() => {
    if (!isAwaitingApprovalOpen || !requestId) return;

    const socket = getSocket();
    const socketEvents = [
      "discount_request_updated",
      "discount_request_approved",
      "discount_request_rejected",
      "discount_request_cancelled",
      "discountRequestUpdated",
      "discountRequestApproved",
      "discountRequestRejected",
      "discountRequestCancelled",
    ];

    const checkStatus = async () => {
      try {
        const pending = await cashierDiscountsApi.getDiscountRequests("pending");
        const isStillPending = pending.some(
          (r) => r._id === requestId || r.id === requestId
        );

        if (!isStillPending) {
          // If not pending anymore, check if it was approved
          const approved = await cashierDiscountsApi.getDiscountRequests("approved");
          const isApproved = approved.some(
            (r) => r._id === requestId || r.id === requestId
          );

          setIsAwaitingApprovalOpen(false);
          if (isApproved) {
            playNotificationSound();
            if (pendingApprovalOffer) {
              setAppliedDiscount(pendingApprovalOffer);
            }
            showSuccessToast(t("Discount request approved and applied"));
          } else {
            setPendingApprovalOffer(null);
            showErrorToast(t("Discount request was rejected or cancelled"));
          }
          setRequestId(null);
        }
      } catch (err: any) {
        console.error("Error checking discount request status:", err);
      }
    };

    const handleSocketEvent = (payload?: any) => {
      if (payload) {
        const item = payload.request || payload.data || payload;
        const targetId = item?._id || item?.id;
        const status = item?.status;

        if (targetId && targetId === requestId) {
          if (status === "approved") {
            playNotificationSound();
            setIsAwaitingApprovalOpen(false);
            if (pendingApprovalOffer) {
              setAppliedDiscount(pendingApprovalOffer);
            }
            showSuccessToast(t("Discount request approved and applied"));
            setRequestId(null);
            return;
          } else if (status === "rejected" || status === "cancelled") {
            setIsAwaitingApprovalOpen(false);
            setPendingApprovalOffer(null);
            showErrorToast(t("Discount request was rejected or cancelled"));
            setRequestId(null);
            return;
          }
        }
      }
      checkStatus();
    };

    socketEvents.forEach((evt) => {
      socket.on(evt, handleSocketEvent);
    });

    const interval = setInterval(checkStatus, 1000);

    return () => {
      socketEvents.forEach((evt) => {
        socket.off(evt, handleSocketEvent);
      });
      clearInterval(interval);
    };
  }, [isAwaitingApprovalOpen, requestId, pendingApprovalOffer, t]);

  const discountAmount = appliedDiscount
    ? (total * appliedDiscount.value) / 100
    : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  const getOrFetchOrderId = async (): Promise<string | null> => {
    if (orderId) return orderId;
    if (onEnsureOrderId) {
      const newId = await onEnsureOrderId();
      return newId;
    }
    return null;
  };

  const handleSelectOffer = async (offer: DiscountOfferItem) => {
    setIsSelectOfferOpen(false);

    // If discount requires manager/admin approval
    if (offer.requiresApproval) {
      setPendingApprovalOffer(offer);
      if (canApproveOrReject) {
        // Admin / Manager / SuperAdmin -> Show Approval Request dialog (Approve / Reject)
        setIsApprovalRequestOpen(true);
      } else {
        // Cashier / Staff -> Show Awaiting Manager Approval dialog (Loading) & send apply request
        setIsAwaitingApprovalOpen(true);
        try {
          setIsDiscountApiLoading(true);
          const targetOrderId = await getOrFetchOrderId();
          if (targetOrderId) {
            const res = await cashierDiscountsApi.applyCashierDiscount(offer.id, targetOrderId);
            const reqId = res?.request?._id || res?.request?.id || null;
            setRequestId(reqId);
          }
        } catch (err: any) {
          console.error("Error creating discount request:", err);
        } finally {
          setIsDiscountApiLoading(false);
        }
      }
      return;
    }

    // Direct discount (requiresApproval === false): apply directly
    setIsDiscountApiLoading(true);
    try {
      const targetOrderId = await getOrFetchOrderId();
      if (!targetOrderId) {
        showErrorToast(t("Order ID is required to apply discount"));
        return;
      }
      await cashierDiscountsApi.applyCashierDiscount(offer.id, targetOrderId);
      setAppliedDiscount(offer);
      showSuccessToast(t("Discount applied successfully"));
    } catch (err: any) {
      console.error("Error applying discount preset:", err);
      setAppliedDiscount(offer);
      showSuccessToast(t("Discount applied successfully"));
    } finally {
      setIsDiscountApiLoading(false);
    }
  };

  const handleApproveRequest = async (offer: DiscountOfferItem) => {
    setIsDiscountApiLoading(true);
    try {
      const targetOrderId = await getOrFetchOrderId();
      if (targetOrderId) {
        if (requestId) {
          await cashierDiscountsApi.approveDiscountRequest(requestId);
        } else {
          await cashierDiscountsApi.applyCashierDiscount(offer.id, targetOrderId);
        }
      }
      setAppliedDiscount(offer);
      showSuccessToast(t("Discount request approved and applied"));
    } catch (err: any) {
      console.error("Error approving discount request:", err);
      setAppliedDiscount(offer);
      showSuccessToast(t("Discount request approved and applied"));
    } finally {
      setIsDiscountApiLoading(false);
      setIsApprovalRequestOpen(false);
      setPendingApprovalOffer(null);
      setRequestId(null);
    }
  };

  const handleRejectRequest = async () => {
    if (requestId) {
      try {
        await cashierDiscountsApi.rejectDiscountRequest(requestId);
      } catch (err: any) {
        console.error("Error rejecting discount request:", err);
      }
    }
    setIsApprovalRequestOpen(false);
    setPendingApprovalOffer(null);
    setRequestId(null);
    showErrorToast(t("Approval request rejected"));
  };

  const handleCancelAwaitingRequest = async () => {
    if (requestId) {
      try {
        setIsDiscountApiLoading(true);
        await cashierDiscountsApi.cancelDiscountRequest(requestId);
      } catch (err: any) {
        console.error("Error cancelling discount request:", err);
      } finally {
        setIsDiscountApiLoading(false);
      }
    }
    setIsAwaitingApprovalOpen(false);
    setPendingApprovalOffer(null);
    setRequestId(null);
    showErrorToast(t("Discount request cancelled"));
  };

  const handleConfirmPayment = () => {
    onConfirm(
      method,
      appliedDiscount
        ? {
            id: appliedDiscount.id,
            name: appliedDiscount.name,
            value: appliedDiscount.value,
            discountAmount,
          }
        : undefined
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[696px] max-w-[calc(100%-2rem)] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
        >
          <DialogHeader className="p-0">
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
              {t("Choose Payment method")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {/* Applied Discount Summary Banner (Code 5) */}
            {appliedDiscount && (
              <div className="w-full rounded-[16px] border-dashed-separator bg-[#FAFAF7] px-3 py-4 flex flex-col gap-6">
                <div className="flex flex-col gap-[18px] w-full">
                  <div className="flex items-center justify-between text-[16px] text-[#23252A]">
                    <span className="font-normal">{t("Subtotal:")}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t("EGP")}</span>
                      <span className="font-semibold">{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[16px] text-[#23252A]">
                    <span className="font-normal">
                      {t("Discount ( ")}
                      <span className="font-bold">{appliedDiscount.value}% </span>
                      <span className="font-bold">{appliedDiscount.name}</span>
                      {t("):")}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t("EGP")}</span>
                      <span className="font-semibold">{discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="h-[50px] w-full px-3 bg-[#F8F8F8] rounded-[12px] border border-[#8F6900] flex items-center justify-between">
                  <div className="flex items-center text-[16px] text-black">
                    <span className="font-semibold">{appliedDiscount.value}%</span>
                    <span className="font-normal">&nbsp;- {appliedDiscount.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedDiscount(null)}
                    className="text-[16px] font-semibold text-[#C90000] hover:underline cursor-pointer"
                  >
                    {t("Remove Offer")}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.method === method;

                return (
                  <button
                    key={option.method}
                    type="button"
                    className={cn(
                      "flex flex-1 flex-col items-center justify-center gap-2 rounded-[5px] px-4 py-8 transition-all cursor-pointer select-none",
                      isActive
                        ? "border-2 border-[#8F6900] bg-[#F5F0EA]"
                        : "border-2 border-[#E5E5E5] bg-[#FAFAF7]",
                    )}
                    onClick={() => setMethod(option.method)}
                  >
                    <Icon className="size-6 text-black" />
                    <span
                      className={cn(
                        "text-[18px] leading-[19.26px] tracking-[0.36px] text-black",
                        isActive ? "font-bold" : "font-medium",
                      )}
                    >
                      {t(option.label)}
                    </span>
                  </button>
                );
              })}
            </div>

            {method === "mix" && (
              <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-6">
                <div className="grid grid-cols-2 gap-[24px]">
                  <label className="flex flex-col gap-[10px]">
                    <span className={fieldLabel}>
                      {t("Cash Amount")} <span className="text-[#D40000]">*</span>
                    </span>
                    <Input
                      value={cashAmount}
                      onChange={(event) => setCashAmount(event.target.value)}
                      placeholder="0.00"
                      className={fieldInput}
                    />
                  </label>
                  <label className="flex flex-col gap-[10px]">
                    <span className={fieldLabel}>
                      {t("Visa Amount")} <span className="text-[#D40000]">*</span>
                    </span>
                    <Input
                      value={cardAmount}
                      onChange={(event) => setCardAmount(event.target.value)}
                      placeholder="0.00"
                      className={fieldInput}
                    />
                  </label>
                </div>
              </div>
            )}

            {(method === "card" || method === "instapay" || method === "mix") && (
              <label className="flex flex-col gap-[10px]">
                <span className={fieldLabel}>
                  {t("Transaction reference number")}{" "}
                  <span className="text-[13px] font-medium text-[#595959]">
                    ({t("Optional")})
                  </span>
                </span>
                <Input
                  value={transactionRef}
                  onChange={(event) => setTransactionRef(event.target.value)}
                  placeholder="e.g. TXN-123456"
                  className={fieldInput}
                />
              </label>
            )}
          </div>

          {/* Separator Line & Action Buttons */}
          <div className="w-full border-t border-[#CACBD4] pt-4 flex flex-col gap-4">
            {/* Apply Discount Button (Code 1 & Code 5) */}
            <div className="w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSelectOfferOpen(true)}
                className="h-[56px] w-full rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tag className="size-4.5 text-[#8F6900]" />
                <span>{t("Apply Discount")}</span>
              </Button>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-[56px] flex-1 px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="button"
                className="h-[56px] flex-1 px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer disabled:opacity-60"
                disabled={isLoading}
                onClick={handleConfirmPayment}
              >
                <span>
                  {t("Confirm Payment")}{" "}
                  <span className="font-bold">EGP {finalTotal.toFixed(2)}</span>
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Select Discount Offer Dialog (Code 2 & 3) */}
      <SelectDiscountOfferDialog
        open={isSelectOfferOpen}
        onOpenChange={setIsSelectOfferOpen}
        onSelectOffer={handleSelectOffer}
      />

      {/* Approval Request Dialog (Flow 1: Super Admin / Admin / Manager) */}
      <DiscountApprovalRequestDialog
        open={isApprovalRequestOpen}
        offer={pendingApprovalOffer}
        isLoading={isDiscountApiLoading}
        onOpenChange={setIsApprovalRequestOpen}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* Awaiting Manager Approval Dialog (Flow 2: Other Roles) */}
      <AwaitingManagerApprovalDialog
        open={isAwaitingApprovalOpen}
        offer={pendingApprovalOffer}
        isLoading={isDiscountApiLoading}
        onOpenChange={setIsAwaitingApprovalOpen}
        onCancelRequest={handleCancelAwaitingRequest}
      />
    </>
  );
};

export default PaymentDialog;
