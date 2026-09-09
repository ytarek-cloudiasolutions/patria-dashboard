import { useEffect, useState } from "react";
import { Banknote, CreditCard, Smartphone, Tag, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

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
import cashierDiscountsApi, {
  type DiscountApprovalRequestItem,
} from "@/features/offers/api/cashierDiscountsApi";
import { getSocket } from "@/shared/lib/socket";
import {
  subscribeDiscountEvents,
  broadcastDiscountEvent,
} from "@/features/offers/utils/discountSocketBus";
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
  const [existingRequest, setExistingRequest] =
    useState<DiscountApprovalRequestItem | null>(null);
  const [isDiscountApiLoading, setIsDiscountApiLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMethod("cash");
    setTransactionRef("");
    setCashAmount("");
    setCardAmount("");
    setAppliedDiscount(null);
    setPendingApprovalOffer(null);
    setExistingRequest(null);
    setRequestId(null);
    setIsSelectOfferOpen(false);
    setIsApprovalRequestOpen(false);
    setIsAwaitingApprovalOpen(false);
  }, [open]);

  // Check if loaded order has an active or resolved discount request
  useEffect(() => {
    if (!open || !orderId) return;

    let isMounted = true;

    const checkOrderDiscount = async () => {
      try {
        const requests = canApproveOrReject
          ? await cashierDiscountsApi.getDiscountRequests("pending")
          : await cashierDiscountsApi.getMyDiscountRequests();

        if (!isMounted) return;

        const match = requests.find((r) => {
          const reqOrderId =
            typeof r.orderId === "object"
              ? r.orderId?._id || r.orderId?.id || r.orderId?.orderId
              : r.orderId;
          return String(reqOrderId) === String(orderId);
        });

        if (match) {
          setExistingRequest(match);
          const matchedId = match._id || match.id || null;
          setRequestId(matchedId);

          const offerObj: DiscountOfferItem = {
            id: match.discountId || match.discount?._id || match.discount?.id || "",
            name: match.discountName || match.discount?.name || "Discount",
            value: match.discountValue ?? match.discount?.value ?? 0,
            requiresApproval: true,
          };
          setPendingApprovalOffer(offerObj);

          if (match.status === "approved") {
            setAppliedDiscount(offerObj);
          } else if (match.status === "pending") {
            // Show Awaiting Manager Approval dialog until approved, rejected, or cancelled
            setIsAwaitingApprovalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error checking order discount request:", err);
      }
    };

    checkOrderDiscount();

    return () => {
      isMounted = false;
    };
  }, [open, orderId, canApproveOrReject]);

  // Real-time socket listener for instant approval/rejection updates
  useEffect(() => {
    if (!open) return;

    const unsubscribe = subscribeDiscountEvents((eventName, payload) => {
      if (!payload) return;
      const item = payload.request || payload.data || payload;
      const targetId = item?._id || item?.id;
      const targetOrderId =
        typeof item?.orderId === "object"
          ? item.orderId?._id || item.orderId?.id || item.orderId?.orderId
          : item?.orderId;
      const status = item?.status;

      const isMatch =
        (targetId && (targetId === requestId || targetId === existingRequest?._id || targetId === existingRequest?.id)) ||
        (orderId && targetOrderId && String(targetOrderId) === String(orderId));

      if (isMatch) {
        if (status === "approved") {
          playNotificationSound();
          setIsAwaitingApprovalOpen(false);
          const offerToApply = pendingApprovalOffer || {
            id: item?.discountId || item?.discount?._id || item?.discount?.id || "",
            name: item?.discountName || item?.discount?.name || "Discount",
            value: item?.discountValue ?? item?.discount?.value ?? 0,
            requiresApproval: true,
          };
          setAppliedDiscount(offerToApply);
          setExistingRequest((prev) => (prev ? { ...prev, status: "approved" } : item));
          showSuccessToast(t("Discount request approved and applied"));
        } else if (status === "rejected" || status === "cancelled") {
          setIsAwaitingApprovalOpen(false);
          setAppliedDiscount(null);
          setExistingRequest((prev) => (prev ? { ...prev, status: "rejected" } : item));
          showErrorToast(t("Discount request was rejected or cancelled"));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [open, requestId, existingRequest, orderId, pendingApprovalOffer, t]);

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

            // Broadcast socket & cross-tab event so manager dashboard receives instant real-time notification
            const reqItem = res?.request || res;
            if (reqItem) {
              const payload = { request: reqItem, data: reqItem, status: "pending", _id: reqId, id: reqId };
              broadcastDiscountEvent("discount_request_created", payload);
              broadcastDiscountEvent("cashier_discount_request", payload);
            }
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
          broadcastDiscountEvent("discount_request_approved", {
            request: { _id: requestId, id: requestId, status: "approved" },
            status: "approved",
            id: requestId,
          });
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
        broadcastDiscountEvent("discount_request_rejected", {
          request: { _id: requestId, id: requestId, status: "rejected" },
          status: "rejected",
          id: requestId,
        });
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
        broadcastDiscountEvent("discount_request_cancelled", {
          request: { _id: requestId, id: requestId, status: "cancelled" },
          status: "cancelled",
          id: requestId,
        });
      } catch (err: any) {
        console.error("Error cancelling discount request:", err);
      } finally {
        setIsDiscountApiLoading(false);
      }
    }
    setIsAwaitingApprovalOpen(false);
    setPendingApprovalOffer(null);
    setExistingRequest(null);
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
            {/* 1. Applied Discount Summary Banner (Approved) */}
            {appliedDiscount && (
              <div className="w-full rounded-[16px] border-dashed-separator bg-[#FAFAF7] px-3 py-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#059B5A] bg-[#E2F4ED] border border-[#059B5A] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="size-3.5" />
                    <span>{t("Discount Approved & Applied")}</span>
                  </div>
                </div>
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
                    onClick={() => {
                      setAppliedDiscount(null);
                      setExistingRequest(null);
                    }}
                    className="text-[16px] font-semibold text-[#C90000] hover:underline cursor-pointer"
                  >
                    {t("Remove Offer")}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Still Pending (Awaiting Approval) Banner */}
            {!appliedDiscount && existingRequest && existingRequest.status === "pending" && (
              <div className="w-full rounded-[14px] bg-[#FFF9E6] border border-[#8F6900] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4.5 text-[#8F6900] shrink-0" />
                    <span className="text-[14px] font-bold text-[#8F6900]">
                      {t("Discount Request Awaiting Approval")}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8F6900] text-white">
                    {t("Pending")}
                  </span>
                </div>
                <div className="text-[13px] text-[#333333]">
                  <span className="font-bold">{existingRequest.discountValue ?? existingRequest.discount?.value ?? 0}% {t("Discount")}</span>
                  {" — "}
                  <span className="font-medium">{existingRequest.discountName || existingRequest.discount?.name || "Discount"}</span>
                </div>
                <p className="text-[12px] text-[#666666] leading-relaxed">
                  {t("This order has a discount request awaiting manager approval. You can wait for approval or proceed with the order now.")}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#8F6900]/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAwaitingApprovalOpen(true)}
                    className="h-[36px] px-3 rounded-[6px] border border-[#8F6900] bg-white text-[12px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="size-3.5" />
                    <span>{t("Wait / View Request")}</span>
                  </Button>
                  <span className="text-[11px] text-[#8B8B8B] font-medium">
                    {t("Or proceed with payment below")}
                  </span>
                </div>
              </div>
            )}

            {/* 3. Rejected Banner */}
            {!appliedDiscount && existingRequest && existingRequest.status === "rejected" && (
              <div className="w-full rounded-[14px] bg-[#FDE8E8] border border-[#C90000] p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4.5 text-[#C90000] shrink-0" />
                  <span className="text-[14px] font-bold text-[#C90000]">
                    {t("Discount Request Rejected")}
                  </span>
                </div>
                <p className="text-[12px] text-[#595959] leading-relaxed">
                  {t("The manager rejected the discount request for this order. You can proceed with the order at regular price.")}
                </p>
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
        onOpenChange={(open) => {
          setIsAwaitingApprovalOpen(open);
          if (!open) {
            // Cashier closed the dialog to see another order
            onOpenChange(false);
          }
        }}
        onCancelRequest={handleCancelAwaitingRequest}
      />
    </>
  );
};

export default PaymentDialog;

