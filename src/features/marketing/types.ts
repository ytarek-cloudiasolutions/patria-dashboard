// Matches backend/src/utils/customerSegments.js SEGMENTS exactly.
export type AudienceSegment =
  | "all"
  | "havent_ordered_lately"
  | "never_ordered"
  | "ordered_recently"
  | "loyal"
  | "birthday";

export type GenderFilter = "all" | "women" | "men";

export type WhatsAppSourceMode = "audience" | "numbers" | "sheet";

export type ScheduleFrequency = "everyday" | "weekday" | "once";

export interface AudienceCriteria {
  segment: AudienceSegment;
  gender: GenderFilter;
  interests: string[]; // Category ids
}

export interface Recipient {
  id: string;
  name: string;
  phone: string;
  gender?: "woman" | "man";
  hasApp?: boolean;
}

export interface PushNotificationDraft {
  title: string;
  message: string;
  testPhone: string;
}

export interface WhatsAppCampaignDraft {
  sourceMode: WhatsAppSourceMode;
  rawNumbers: string;
  sheetFileName?: string;
  message: string;
  imageUrl?: string;
  imageFile?: File;
  secondsDelay: number;
}

export interface ScheduledNotificationDraft {
  frequency: ScheduleFrequency;
  selectedWeekday?: string;
  onceDate?: string;
  time: string; // e.g. "10:00 AM" or "06:28:55 PM"
  title: string;
  message: string;
}

export interface AbandonedCartConfig {
  enabled: boolean;
  title: string;
  message: string;
  delayMinutes: number;
  channels: { app: boolean; whatsapp: boolean };
}

export interface MarketingKPIs {
  appOrdersCount: number;
  appOrdersRevenue: number;
  websiteOrdersCount: number;
  websiteOrdersRevenue: number;
  newSignups: number;
  averageRating: number;
  reviewsCount: number;
  complaintsCount: number;
}

export interface DailyOrderStat {
  id: string;
  date: string;
  appOrders: number;
  webOrders: number;
  totalOrders: number;
}

export interface DeliveryZoneStat {
  id: string;
  zoneName: string;
  ordersCount: number;
  percentage: number;
  customersCount: number;
  revenue: number;
}

export interface ComplaintReview {
  id: string;
  customerName: string;
  customerPhone: string;
  rating: number; // e.g. 1.5, 2.0
  orderNumber: string;
  orderType: "Delivery" | "Takeaway" | "Dine-in";
  comment: string;
  tags: string[];
  timestamp: string;
}

export interface MarketingCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "woman" | "man";
  joinedDate: string;
  hasApp: boolean;
  appStatus: "active" | "unactive" | "none";
  ordersCount: number;
  totalSpent: number;
  averageOrder: number;
  lastOrderDate: string;
  lastOrderTimestamp: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  tierTitle: string;
  ltv: number;
  ordersTotalSpent: number;
  mostOrderedProducts: {
    id: string;
    name: string;
    pieces: number;
    ordersCount: number;
    isTop?: boolean;
  }[];
  favoriteCategories: {
    name: string;
    count: number;
  }[];
  ordersToZones: {
    zoneName: string;
    count: number;
  }[];
  ordersHistory: {
    id: string;
    orderNumber: string;
    date: string;
    source: "POS" | "App" | "Call";
    status: "Preparing" | "Delivered" | "Pending" | "Cancelled";
    zone: string;
    totalAmount: number;
    itemsSummary: string;
  }[];
}

export type MarketingTab =
  | "app-notifications"
  | "whatsapp-campaign"
  | "scheduled-notifications"
  | "reports-complaints"
  | "customers";
