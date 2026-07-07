import type { Offer, DiscountType } from "../types";

export const formatDateString = (value: string): string => {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export const formatPeriodFromDates = (start: string, end: string): string => {
  const startLabel = formatDateString(start);
  const endLabel = formatDateString(end);
  if (!startLabel && !endLabel) return "—";
  let year = "";
  try {
    const d = new Date(end || start);
    if (!isNaN(d.getTime())) {
      year = `, ${d.getFullYear()}`;
    }
  } catch {}
  return `${startLabel} - ${endLabel}${year}`;
};

export const mapOffer = (o: any): Offer => {
  return {
    id: o._id || o.id,
    offerStatus: (o.status || "").toLowerCase() === "active",
    offerTitle: o.name || "",
    offerDescription: o.description || "",
    offerPercentage: o.discountValue ?? 0,
    discountType: (o.discountType === "fixed" ? "fixed" : "percentage") as DiscountType,
    offerValidPeriod: formatPeriodFromDates(o.startDate || "", o.endDate || ""),
    numberOfProducts: (o.productIds || o.includedProducts || []).length,
    offerImage: o.image || o.offerImage || o.bannerImage,
    startDate: o.startDate,
    endDate: o.endDate,
    usageCount: o.usageCount ?? 0,
    code: o.code || "",
    usageLimit: o.usageLimit !== undefined ? o.usageLimit : null,
    minOrderAmount: o.minOrderAmount !== undefined ? o.minOrderAmount : null,
    claimsCount: o.claimsCount ?? o.usageCount ?? 0,
  };
};

export const mapOffers = (offers: any[]): Offer[] => {
  return (offers || []).map(mapOffer);
};
