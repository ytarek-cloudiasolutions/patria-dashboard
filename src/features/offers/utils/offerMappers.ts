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
  // productIds may come back as plain strings OR full product objects
  const rawIds: any[] = o.productIds || o.includedProducts || [];
  let productName: string | undefined = o.productName;
  const productIds: string[] = rawIds
    .map((p: any) => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object") {
        if (!productName && p.name) productName = p.name;
        return p._id ?? p.id ?? "";
      }
      return "";
    })
    .filter(Boolean);

  const isBanner = o.isBanner === true || o.isBanner === "true";

  return {
    id: o._id || o.id,
    offerStatus: (o.status || "").toLowerCase() === "active",
    offerTitle: o.name || "",
    offerDescription: o.description || "",
    offerPercentage: o.discountValue ?? 0,
    discountType: (o.discountType === "fixed" ? "fixed" : "percentage") as DiscountType,
    offerValidPeriod:
      isBanner && o.releaseDate
        ? formatDateString(o.releaseDate)
        : formatPeriodFromDates(o.startDate || "", o.endDate || ""),
    numberOfProducts: productIds.length,
    offerImage: o.image || o.offerImage || o.bannerImage,
    startDate: o.startDate,
    endDate: o.endDate,
    usageCount: o.usageCount ?? 0,
    code: o.code || "",
    usageLimit: o.usageLimit !== undefined ? o.usageLimit : null,
    minOrderAmount: o.minOrderAmount !== undefined ? o.minOrderAmount : null,
    claimsCount: o.claimsCount ?? o.usageCount ?? 0,
    productIds,
    isBanner,
    releaseDate: o.releaseDate,
    productId: o.productId || (productIds.length === 1 ? productIds[0] : undefined),
    productName,
  };
};

export const mapOffers = (offers: any[]): Offer[] => {
  return (offers || []).map(mapOffer);
};
