export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface ApprovalRequest {
  id: string;
  orderId: string;
  requestedBy: string;
  discount: string;
  approvedBy: string;
  status: ApprovalStatus;
  date: string;
}

export type ApprovalStatusFilter = "all" | "pending" | "approved" | "rejected";
