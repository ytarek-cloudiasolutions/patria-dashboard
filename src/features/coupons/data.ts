import type { CouponProps } from "./types";

export const MOCK_COUPONS: CouponProps[] = [
  {
    id: 1,
    code: "WELCOME20",
    discountType: "Fixed",
    discountValue: 50,
    usageCount: 2,
    usageLimit: undefined,
    startDate: "2026-04-07",
    endDate: "2026-04-14",
    isActive: true,
  },
  {
    id: 2,
    code: "RMDKAREEM",
    discountType: "Percentage",
    discountValue: 20,
    minOrderFee: 85,
    usageCount: 2,
    usageLimit: 20,
    startDate: "2026-04-07",
    endDate: "2026-04-14",
    isActive: false,
  },
  {
    id: 3,
    code: "FIRST30",
    discountType: "Percentage",
    discountValue: 30,
    minOrderFee: 150,
    usageCount: 10,
    usageLimit: undefined,
    startDate: "2026-04-07",
    endDate: "2026-04-14",
    isActive: true,
  },
];
