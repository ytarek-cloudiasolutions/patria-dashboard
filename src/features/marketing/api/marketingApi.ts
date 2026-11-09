import { api } from "@/config/api";

export type BackendSegment =
  | "all"
  | "never_ordered"
  | "ordered_recently"
  | "havent_ordered_lately"
  | "loyal"
  | "birthday";

export type BackendGender = "all" | "male" | "female";

export interface AudienceInput {
  segment?: BackendSegment;
  gender?: BackendGender;
  interests?: string[]; // Category ids
}

export interface AudienceSegmentCounts {
  all: number;
  never_ordered: number;
  ordered_recently: number;
  havent_ordered_lately: number;
  loyal: number;
  birthday: number;
}

export interface MarketingCampaign {
  _id: string;
  channel: "app" | "whatsapp";
  title?: string;
  message: string;
  image?: string | null;
  audience: { segment: BackendSegment; gender: BackendGender; interests: { _id: string; name: string }[] };
  status: "scheduled" | "sending" | "sent" | "failed" | "cancelled";
  scheduledAt: string | null;
  sentAt: string | null;
  stats: { targeted: number; sent: number; failed: number };
  error: string | null;
  createdBy?: { name: string; email: string };
  createdAt: string;
}

export interface AbandonedCartConfig {
  enabled: boolean;
  delayMinutes: number;
  channels: { app: boolean; whatsapp: boolean };
  title: string;
  message: string;
}

function interestsParam(interests?: string[]) {
  return interests?.length ? interests.join(",") : undefined;
}

export const marketingApi = {
  getAudienceSegments: async (opts: AudienceInput = {}): Promise<AudienceSegmentCounts> => {
    const response = await api.get<{ segments: AudienceSegmentCounts }>("/marketing/audience-segments", {
      params: { gender: opts.gender, interests: interestsParam(opts.interests) },
    });
    return response.data.segments;
  },

  sendAppNotification: async (data: AudienceInput & { title: string; body: string; scheduledAt?: string | null }) => {
    const response = await api.post<{ campaign: MarketingCampaign }>("/marketing/notifications/send", data);
    return response.data.campaign;
  },

  sendWhatsappCampaign: async (data: AudienceInput & { message: string; image?: string; scheduledAt?: string | null }) => {
    const response = await api.post<{ campaign: MarketingCampaign }>("/marketing/whatsapp/send", data);
    return response.data.campaign;
  },

  testSend: async (data: { channel: "app" | "whatsapp"; phone: string; title?: string; message: string }) => {
    const response = await api.post("/marketing/test-send", data);
    return response.data;
  },

  getCampaigns: async (params: { channel?: "app" | "whatsapp"; status?: MarketingCampaign["status"] } = {}): Promise<MarketingCampaign[]> => {
    const response = await api.get<{ campaigns: MarketingCampaign[] }>("/marketing/campaigns", { params });
    return response.data.campaigns;
  },

  cancelCampaign: async (id: string) => {
    const response = await api.delete<{ campaign: MarketingCampaign }>(`/marketing/campaigns/${id}`);
    return response.data.campaign;
  },

  getAbandonedCartConfig: async (): Promise<AbandonedCartConfig> => {
    const response = await api.get<{ config: AbandonedCartConfig }>("/marketing/abandoned-cart-config");
    return response.data.config;
  },

  updateAbandonedCartConfig: async (data: Partial<AbandonedCartConfig>): Promise<AbandonedCartConfig> => {
    const response = await api.put<{ config: AbandonedCartConfig }>("/marketing/abandoned-cart-config", data);
    return response.data.config;
  },
};

export default marketingApi;
