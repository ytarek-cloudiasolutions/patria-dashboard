import type { DiscountApprovalRequestItem } from "@/features/offers/api/cashierDiscountsApi";
import type { ApprovalRequest, ApprovalStatus } from "./types";

const STATUS_MAP: Record<string, ApprovalStatus> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

/** Maps a real `/cashier-discounts/requests` row to what this page renders. */
export function mapApprovalRequest(item: DiscountApprovalRequestItem): ApprovalRequest | null {
  const status = STATUS_MAP[item.status];
  if (!status) return null; // "cancelled" requests (withdrawn by the cashier) aren't shown here

  const order = typeof item.orderId === "object" ? item.orderId : null;
  const orderLabel = order?.orderId || (typeof item.orderId === "string" ? item.orderId : "-");

  const discountValue = item.discountValue ?? item.discount?.value;
  const discountLabel =
    discountValue != null ? `${discountValue}${item.discountType === "fixed" ? " EGP" : "%"}` : "-";

  return {
    id: item._id || item.id || "",
    orderId: orderLabel.startsWith("#") ? orderLabel : `#${orderLabel}`,
    requestedBy: item.requestedBy?.name || "-",
    discount: discountLabel,
    approvedBy: item.respondedBy?.name || "-",
    status,
    date: item.updatedAt || item.createdAt || "",
  };
}
