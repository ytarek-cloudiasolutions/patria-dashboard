import type { Order, OrderStatus, OrderSource, PaymentState } from "../types";

export const mapOrderStatus = (backendStatus: string): OrderStatus => {
  const status = (backendStatus || "").toLowerCase();
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "On The Way";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
};

export const mapOrderStatusToBackend = (uiStatus: OrderStatus): string => {
  switch (uiStatus) {
    case "Pending":
      return "pending";
    case "Confirmed":
      return "confirmed";
    case "Preparing":
      return "preparing";
    case "On The Way":
      return "ready";
    case "Delivered":
      return "delivered";
    case "Cancelled":
      return "cancelled";
    default:
      return "pending";
  }
};

export const mapOrder = (o: any): Order => {
  const dateObj = o.createdAt ? new Date(o.createdAt) : new Date();
  const dateStr = dateObj.toLocaleDateString("en-GB");
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const items = (o.items || []).map((item: any, idx: number) => {
    const product = item.productId || item.product || {};
    const notesStr = item.notes || "";
    const selectedExtras: { name: string; price: number }[] = [];
    const selectedVariants: { group: string; option: string; priceAdjustment: number }[] = [];
    const unmatchedNotes: string[] = [];
    const availableExtras = product.extras || [];
    const availableVariantGroups = product.variantGroups || [];

    if (item.selectedExtras && item.selectedExtras.length > 0) {
      selectedExtras.push(...item.selectedExtras.map((e: any) => ({
        name: e.name || "",
        price: e.price || 0,
      })));
    }

    if (item.selectedVariants && item.selectedVariants.length > 0) {
      selectedVariants.push(...item.selectedVariants.map((v: any) => ({
        group: v.group || v.groupName || "",
        option: v.option || v.optionName || "",
        priceAdjustment: v.priceAdjustment || v.price || 0,
      })));
    }

    if (notesStr) {
      const noteParts = notesStr.split(",").map((s: string) => s.trim());
      for (const part of noteParts) {
        if (!part) continue;

        // Try to match variant if there is a colon (e.g. "Size: Large" or "الحجم: كبير")
        let isVariantMatched = false;
        if (part.includes(":")) {
          const colonIndex = part.indexOf(":");
          const groupName = part.substring(0, colonIndex).trim();
          const optionName = part.substring(colonIndex + 1).trim();

          const matchedGroup = availableVariantGroups.find(
            (g: any) => g.name.trim().toLowerCase() === groupName.toLowerCase()
          );
          if (matchedGroup) {
            const matchedOption = matchedGroup.options.find(
              (opt: any) => opt.name.trim().toLowerCase() === optionName.toLowerCase()
            );
            if (matchedOption) {
              const alreadyAdded = selectedVariants.some(
                (v) => v.group.toLowerCase() === matchedGroup.name.toLowerCase()
              );
              if (!alreadyAdded) {
                selectedVariants.push({
                  group: matchedGroup.name,
                  option: matchedOption.name,
                  priceAdjustment: matchedOption.priceAdjustment || matchedOption.price || 0,
                });
              }
              isVariantMatched = true;
            }
          }
        }

        if (isVariantMatched) continue;

        // Try to match extra
        const matchingExtra = availableExtras.find(
          (ext: any) => ext.name.trim().toLowerCase() === part.toLowerCase()
        );
        if (matchingExtra) {
          const alreadyAdded = selectedExtras.some(
            (e) => e.name.toLowerCase() === matchingExtra.name.toLowerCase()
          );
          if (!alreadyAdded) {
            selectedExtras.push({
              name: matchingExtra.name,
              price: matchingExtra.price || 0,
            });
          }
        } else {
          unmatchedNotes.push(part);
        }
      }
    }

    return {
      id: product._id || product.id || String(idx),
      productId: product._id || product.id,
      name: product.name || "Unknown Product",
      quantity: item.quantity || 0,
      unitPrice: item.price || product.price || 0,
      note: unmatchedNotes.join(", "),
      selectedVariants,
      selectedExtras,
    };
  });

  const subtotal = items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

  let paymentState: PaymentState = "Waiting for payment";
  if (o.paymentStatus === "paid" || o.isPaid) {
    paymentState = "Paid";
  }

  const rawCat = items[0]?.category || "Coffee";
  const category =
    rawCat === "Bakery" || rawCat === "Meals" || rawCat === "Sandwiches"
      ? rawCat
      : "Coffee";

  const zone =
    (typeof o.zone === "string" ? o.zone : o.zone?.name) ||
    (typeof o.region === "string" ? o.region : o.region?.name) ||
    (typeof o.customer?.region === "string" ? o.customer?.region : o.customer?.region?.name) ||
    (typeof o.customer?.zone === "string" ? o.customer?.zone : o.customer?.zone?.name) ||
    (typeof o.customerId?.region === "string" ? o.customerId?.region : o.customerId?.region?.name) ||
    (typeof o.customerId?.zone === "string" ? o.customerId?.zone : o.customerId?.zone?.name) ||
    (Array.isArray(o.customerId?.addresses) && (o.customerId.addresses.find((a: any) => a.isDefault) || o.customerId.addresses[0])?.zone) ||
    (Array.isArray(o.customer?.addresses) && (o.customer.addresses.find((a: any) => a.isDefault) || o.customer.addresses[0])?.zone) ||
    (Array.isArray(o.customerId?.addresses) && (o.customerId.addresses.find((a: any) => a.isDefault) || o.customerId.addresses[0])?.area) ||
    (Array.isArray(o.customer?.addresses) && (o.customer.addresses.find((a: any) => a.isDefault) || o.customer.addresses[0])?.area) ||
    "";

  return {
    id: o._id || o.id,
    orderId: o.orderId || null,
    customerName: o.customerId?.name || o.customer?.name || o.customerName || "Walk-in Customer",
    customerPhone: o.customerId?.phone || o.customer?.phone || o.customerPhone || "",
    customerEmail: o.customerId?.email || o.customer?.email || o.customerEmail || "",
    address: o.customer?.address || o.address || ((o.type || "").toLowerCase() === "takeaway" ? "Takeaway" : "In Store"),
    zone,
    date: dateStr,
    time: timeStr,
    total: o.totalAmount || o.total || subtotal,
    gross: o.gross ?? (o.subtotal || subtotal) + (o.tax || 0),
    subtotal: o.subtotal || subtotal,
    discount: o.discountAmount ?? o.discount ?? 0,
    deliveryFee: o.deliveryFee || 0,
    status: mapOrderStatus(o.status),
    category,
    source: (o.source || (o.type === "takeaway" ? "call" : "application")).toLowerCase() as OrderSource,
    paymentMethod: o.paymentMethod || "Cash on delivery",
    paymentState,
    type: o.type,
    items,
    driver: o.assignedDriver?.name || o.driver || undefined,
  };
};

export const mapOrders = (orders: any[]): Order[] => {
  return (orders || []).map(mapOrder);
};
