import { api } from "@/config/api";

export interface Complaint {
  _id: string;
  customerId?: { _id: string; name: string; phone: string };
  orderId?: { _id: string; orderId: string; total?: number; type?: string } | null;
  category: "delivery" | "product_quality" | "order_issue" | "app_issue" | "staff_behavior" | "other";
  message: string;
  rating: number | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high";
  assignedTo?: { _id: string; name: string } | null;
  response: string;
  respondedBy?: { _id: string; name: string } | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface ComplaintStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  avgRating: number | null;
  ratedCount: number;
}

export const complaintsApi = {
  getComplaints: async (params: { status?: string; category?: string; from?: string; to?: string } = {}): Promise<Complaint[]> => {
    const response = await api.get<{ complaints: Complaint[] }>("/complaints", { params });
    return response.data.complaints;
  },

  getComplaintStats: async (): Promise<ComplaintStats> => {
    const response = await api.get<{ stats: ComplaintStats }>("/complaints/stats");
    return response.data.stats;
  },

  updateComplaint: async (
    id: string,
    data: Partial<Pick<Complaint, "status" | "priority" | "response">> & { assignedTo?: string | null }
  ): Promise<Complaint> => {
    const response = await api.patch<{ complaint: Complaint }>(`/complaints/${id}`, data);
    return response.data.complaint;
  },
};

export default complaintsApi;
