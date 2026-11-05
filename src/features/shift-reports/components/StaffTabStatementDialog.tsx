import { useState, useMemo, useEffect } from "react";
import { Check, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { StaffTabUser, StaffTabOrder } from "../types";

interface StaffTabStatementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StaffTabUser | null;
  onUpdateUser?: (updated: StaffTabUser) => void;
}

export const StaffTabStatementDialog = ({
  open,
  onOpenChange,
  user,
  onUpdateUser,
}: StaffTabStatementDialogProps) => {
  const { t } = useTranslation();
  const [paymentMode, setPaymentMode] = useState<"specific" | "amount">("specific");
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);

  const paymentOptions = useMemo(
    () => [
      { label: t("Cash"), value: "Cash" },
      { label: t("Card"), value: "Card" },
      { label: t("Bank Transfer"), value: "Bank Transfer" },
    ],
    [t]
  );

  // Initialize selection and amount when dialog opens or user changes
  useEffect(() => {
    if (user && open) {
      const unpaidIds = user.orders
        .filter((o) => o.status === "Unpaid")
        .map((o) => o.id);
      setSelectedOrderIds(new Set(unpaidIds));
      setCustomAmount(user.balance > 0 ? user.balance.toFixed(2) : "0.00");
      setNote("");
      setPaymentMethod("Cash");
      setPaymentMode("specific");
    }
  }, [user, open]);

  // Calculate sum of selected orders in "specific" mode
  const selectedTotal = useMemo(() => {
    if (!user) return 0;
    return user.orders
      .filter((o) => selectedOrderIds.has(o.id) && o.status === "Unpaid")
      .reduce((sum, o) => sum + o.price, 0);
  }, [user, selectedOrderIds]);

  if (!user) return null;

  const unpaidOrders = user.orders.filter((o) => o.status === "Unpaid");
  const allUnpaidSelected =
    unpaidOrders.length > 0 &&
    unpaidOrders.every((o) => selectedOrderIds.has(o.id));
  const someUnpaidSelected =
    unpaidOrders.some((o) => selectedOrderIds.has(o.id)) && !allUnpaidSelected;

  const handleToggleSelectAll = () => {
    if (allUnpaidSelected) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(unpaidOrders.map((o) => o.id)));
    }
  };

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleConfirmPayment = () => {
    if (paymentMode === "specific") {
      if (selectedOrderIds.size === 0) {
        showErrorToast(t("Please select at least one order to pay"));
        return;
      }

      const updatedOrders: StaffTabOrder[] = user.orders.map((o) => {
        if (selectedOrderIds.has(o.id) && o.status === "Unpaid") {
          return { ...o, status: "Paid" };
        }
        return o;
      });

      const newRemainingUnpaid = updatedOrders.filter((o) => o.status === "Unpaid");
      const newPaid = user.paid + selectedTotal;
      const newBalance = Math.max(0, user.balance - selectedTotal);

      const updatedUser: StaffTabUser = {
        ...user,
        paid: Number(newPaid.toFixed(2)),
        balance: Number(newBalance.toFixed(2)),
        unpaidOrders: newRemainingUnpaid.length,
        orders: updatedOrders,
      };

      onUpdateUser?.(updatedUser);
      showSuccessToast(t("Payment confirmed successfully"));
      onOpenChange(false);
    } else {
      const amt = parseFloat(customAmount);
      if (isNaN(amt) || amt <= 0) {
        showErrorToast(t("Please enter a valid amount"));
        return;
      }

      // Deduct from oldest unpaid order first
      let remainingPayment = amt;
      const updatedOrders: StaffTabOrder[] = user.orders.map((o) => {
        if (o.status === "Unpaid" && remainingPayment > 0) {
          if (remainingPayment >= o.price) {
            remainingPayment -= o.price;
            return { ...o, status: "Paid" };
          }
        }
        return o;
      });

      const newRemainingUnpaid = updatedOrders.filter((o) => o.status === "Unpaid");
      const newPaid = user.paid + amt;
      const newBalance = Math.max(0, user.balance - amt);

      const updatedUser: StaffTabUser = {
        ...user,
        paid: Number(newPaid.toFixed(2)),
        balance: Number(newBalance.toFixed(2)),
        unpaidOrders: newRemainingUnpaid.length,
        orders: updatedOrders,
      };

      onUpdateUser?.(updatedUser);
      showSuccessToast(t("Payment confirmed successfully"));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 gap-0 ring-0 ring-transparent sm:max-w-200 lg:max-w-225"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col relative">
          {/* Dark overlay when payment method dropdown is open */}
          {isMethodDropdownOpen && (
            <div className="pointer-events-none fixed inset-0 z-60 bg-black/50" />
          )}

          {/* ── Dialog Header ── */}
          <DialogHeader className="shrink-0 px-6 pt-6 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[22px] font-semibold tracking-[0.48px] text-[#28293D] sm:text-[24px]">
              {t(`${user.name}’s balance`)}
            </DialogTitle>
          </DialogHeader>

          {/* ── Scrollable Dialog Body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 sm:px-7 sm:py-6">
            {/* 3 Summary Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {/* Total Orders */}
              <div className="flex h-[115px] flex-col items-center justify-center gap-2 rounded-[16px] border border-primary bg-[#F8F8F8] p-6 shadow-xs">
                <span className="text-[12px] font-semibold tracking-[0.20px] text-primary">
                  {t("Total Orders")}
                </span>
                <div className="flex items-baseline gap-1 text-primary">
                  <span className="text-[18px] font-medium tracking-[0.36px]">EGP</span>
                  <span className="text-[18px] font-semibold tracking-[0.36px]">
                    {" "}{user.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Paid */}
              <div className="flex h-[115px] flex-col items-center justify-center gap-2 rounded-[16px] border border-[#059B5A] bg-[#E2F4ED] p-6 shadow-xs">
                <span className="text-[12px] font-semibold tracking-[0.20px] text-[#059B5A]">
                  {t("Paid")}
                </span>
                <div className="flex items-baseline gap-1 text-[#059B5A]">
                  <span className="text-[18px] font-medium tracking-[0.36px]">EGP</span>
                  <span className="text-[18px] font-bold tracking-[0.36px]">
                    {" "}{user.paid.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Remaining */}
              <div className="flex h-[115px] flex-col items-center justify-center gap-2 rounded-[16px] border border-[#C90000] bg-[#FFF0F0] p-6 shadow-xs">
                <span className="text-[12px] font-semibold tracking-[0.20px] text-[#C90000]">
                  {t("Remaining")}
                </span>
                <div className="flex items-baseline gap-1 text-[#C90000]">
                  <span className="text-[18px] font-medium tracking-[0.36px]">EGP</span>
                  <span className="text-[18px] font-semibold tracking-[0.36px]">
                    {" "}{user.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                  {/* Table Header */}
                  <div
                    className={cn(
                      "grid items-center bg-[#F5F0EA] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D] border-b border-[#E5E5E5]",
                      paymentMode === "specific"
                        ? "grid-cols-[36px_120px_1fr_160px_100px_90px]"
                        : "grid-cols-[120px_1fr_160px_100px_90px]"
                    )}
                  >
                    {paymentMode === "specific" && (
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleToggleSelectAll}
                          disabled={unpaidOrders.length === 0}
                          className={cn(
                            "size-5 rounded-[6px] border flex items-center justify-center transition-all cursor-pointer",
                            allUnpaidSelected
                              ? "bg-primary border-primary text-white"
                              : someUnpaidSelected
                              ? "bg-primary border-primary text-white"
                              : "border-primary bg-white",
                            unpaidOrders.length === 0 && "opacity-40 cursor-not-allowed"
                          )}
                        >
                          {allUnpaidSelected && <Check className="size-3.5 stroke-[3]" />}
                          {someUnpaidSelected && <Minus className="size-3.5 stroke-[3]" />}
                        </button>
                      </div>
                    )}
                    <div>{t("Order ID")}</div>
                    <div className="text-center">{t("Items")}</div>
                    <div className="text-center">{t("Date")}</div>
                    <div className="text-center">{t("Price")}</div>
                    <div className="text-center">{t("Status")}</div>
                  </div>

                  {/* Table Body */}
                  <div className="max-h-[260px] overflow-y-auto">
                    {user.orders.map((order) => {
                      const isPaid = order.status === "Paid";
                      const isSelected = selectedOrderIds.has(order.id);

                      return (
                        <div
                          key={order.id}
                          className={cn(
                            "grid items-center px-4 py-3 text-[14px] transition-colors hover:bg-[#FAFAF7]",
                            paymentMode === "specific"
                              ? "grid-cols-[36px_120px_1fr_160px_100px_90px]"
                              : "grid-cols-[120px_1fr_160px_100px_90px]"
                          )}
                        >
                          {paymentMode === "specific" && (
                            <div className="flex items-center justify-center">
                              {isPaid ? (
                                <div className="size-5 rounded-[6px] border border-[#E9EAEB] bg-[#F7F7F8] flex items-center justify-center text-[#DFE0E2] cursor-not-allowed">
                                  <Minus className="size-3.5 stroke-[2.5]" />
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleOrder(order.id)}
                                  className={cn(
                                    "size-5 rounded-[6px] border flex items-center justify-center transition-all cursor-pointer",
                                    isSelected
                                      ? "bg-primary border-primary text-white"
                                      : "border-primary bg-white hover:border-primary/80"
                                  )}
                                >
                                  {isSelected && <Check className="size-3.5 stroke-[3]" />}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Order ID */}
                          <div className="font-semibold text-[#333333] text-[14px] leading-tight">
                            {order.orderNumber}
                          </div>

                          {/* Items */}
                          <div className="text-[12px] font-medium text-[#595959] px-2 whitespace-normal leading-snug break-words">
                            {order.items}
                          </div>

                          {/* Date */}
                          <div className="text-center text-[12px] font-medium text-[#595959] leading-tight">
                            {(() => {
                              const parts = order.date.split(", ");
                              return parts.length === 2 ? (
                                <>
                                  <div>{parts[0]}</div>
                                  <div>{parts[1]}</div>
                                </>
                              ) : (
                                order.date
                              );
                            })()}
                          </div>

                          {/* Price */}
                          <div className="text-center text-[13px] font-semibold text-black leading-tight">
                            EGP {order.price.toFixed(2)}
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center justify-center">
                            {isPaid ? (
                              <span className="inline-flex items-center justify-center rounded-[30px] border border-[#059B5A] bg-[#E2F4ED] px-3 py-1 text-[12px] font-semibold text-[#059B5A]">
                                {t("Paid")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center rounded-[30px] border border-[#C90000] bg-[#C90000] px-3 py-1 text-[12px] font-semibold text-white">
                                {t("Unpaid")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Separator below the table */}
            <Separator className="bg-[#CACBD4]" />

            {/* Segmented Control / Toggle Tabs */}
            <div className="h-14 w-full rounded-[12px] bg-[#F8F8F8] p-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMode("specific")}
                className={cn(
                  "flex-1 h-10 rounded-[5px] text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center",
                  paymentMode === "specific"
                    ? "bg-[#F5F0EA] text-primary shadow-xs"
                    : "text-black hover:bg-black/5"
                )}
              >
                {t("Pay specific orders")}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("amount")}
                className={cn(
                  "flex-1 h-10 rounded-[5px] text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center",
                  paymentMode === "amount"
                    ? "bg-[#F5F0EA] text-primary shadow-xs"
                    : "text-black hover:bg-black/5"
                )}
              >
                {t("Pay an amount (part of the bill)")}
              </button>
            </div>

            {/* Payment Form Fields */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Payment Method using shared DropdownSelect */}
                <div className="flex flex-col justify-between">
                  <div className="mb-2 flex items-center">
                    <Label className="text-[16px] font-medium text-black">
                      {t("Payment method")}
                    </Label>
                  </div>
                  <DropdownSelect
                    options={paymentOptions}
                    selected={paymentMethod}
                    onSelect={(val) => setPaymentMethod(val)}
                    onOpenChange={setIsMethodDropdownOpen}
                    align="start"
                    className="h-[50px] w-full rounded-[12px] border-[#E5E5E5] bg-white text-[16px]"
                    contentClassName="w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                {/* Amount to Pay */}
                <div className="flex flex-col justify-between">
                  <div className="mb-2">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <Label className="text-[16px] font-medium text-black">
                        {t("Amount to pay")}
                      </Label>
                      {paymentMode === "amount" && (
                        <span className="text-[12px] font-normal text-[#595959]">
                          ({t("Amount deducted from oldest order first")})
                        </span>
                      )}
                    </div>
                  </div>
                  {paymentMode === "specific" ? (
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={`EGP ${selectedTotal.toFixed(2)}`}
                      className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-[16px] font-medium text-black cursor-not-allowed outline-none"
                    />
                  ) : (
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-[16px] font-medium text-black pointer-events-none">
                        EGP
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white pl-16 pr-4 text-[16px] font-medium text-black outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Note (optional) */}
              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Note")}{" "}
                  <span className="text-[13px] font-normal text-[#595959]">
                    ({t("optional")})
                  </span>
                </Label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("e.g. from the October salary")}
                  className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[16px] text-black placeholder:text-[#8B8B8B] outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* ── Sticky Dialog Footer with Separator & DefaultButton ── */}
          <div className="shrink-0 bg-white px-6 pb-6 sm:px-7 sm:pb-7">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary transition-all duration-150 active:scale-[0.98]",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: t("Confirm Payment"),
                  variant: "default",
                  type: "button",
                  onClick: handleConfirmPayment,
                  className:
                    "w-full sm:w-auto bg-primary text-white hover:bg-primary/90 transition-all duration-150 active:scale-[0.98]",
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffTabStatementDialog;
