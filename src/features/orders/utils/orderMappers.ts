import type { Order, OrderStatus, OrderSource, PaymentState } from "../types";

export const mapOrderStatus = (
  backendStatus: string,
  source?: OrderSource,
): OrderStatus => {
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
    // The driver app's "mark delivered" flow sets the order to 'completed'
    // (see driverController.updateOrderStatus), and dine-in POS orders can
    // land on 'served' — both are terminal states in the UI. POS orders use
    // "Completed" so the POS tab mirrors its own lifecycle statuses.
    // Without these, a driver completing delivery looked like it "didn't
    // update" the dashboard (it silently fell through to "Pending" below).
    case "completed":
    case "served":
      return source === "pos" ? "Completed" : "Delivered";
    case "cancelled":
    case "canceled":
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
    case "Completed":
      return "completed";
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
    const product =
      typeof item.productId === "object" && item.productId !== null
        ? item.productId
        : typeof item.product === "object" && item.product !== null
          ? item.product
          : {};
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
      const noteParts = notesStr.split(/\s*-\s*|,\s*|;\s*/).map((s: string) => s.trim());
      for (const part of noteParts) {
        if (!part) continue;

        // Try to match variant if there is a colon (e.g. "Size: Large" or "الحجم: كبير")
        let isVariantMatched = false;
        if (part.includes(":")) {
          const colonIndex = part.indexOf(":");
          const groupName = part.substring(0, colonIndex).trim();
          const optionName = part.substring(colonIndex + 1).trim();

          const alreadyAdded = selectedVariants.some(
            (v) =>
              v.group.toLowerCase() === groupName.toLowerCase() &&
              v.option.toLowerCase() === optionName.toLowerCase()
          );
          if (alreadyAdded) {
            isVariantMatched = true;
          } else {
            const matchedGroup = availableVariantGroups.find(
              (g: any) => g.name.trim().toLowerCase() === groupName.toLowerCase()
            );
            if (matchedGroup) {
              const matchedOption = matchedGroup.options.find(
                (opt: any) => opt.name.trim().toLowerCase() === optionName.toLowerCase()
              );
              if (matchedOption) {
                selectedVariants.push({
                  group: matchedGroup.name,
                  option: matchedOption.name,
                  priceAdjustment: matchedOption.priceAdjustment || matchedOption.price || 0,
                });
                isVariantMatched = true;
              }
            } else if (/^(size|roast\s*level|grind\s*type|type|الحجم)$/i.test(groupName)) {
              selectedVariants.push({
                group: groupName,
                option: optionName,
                priceAdjustment: 0,
              });
              isVariantMatched = true;
            }
          }
        } else {
          const matchedOption = selectedVariants.some(
            (v) => v.option.toLowerCase() === part.toLowerCase()
          );
          if (matchedOption) {
            isVariantMatched = true;
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

    const rawExcluded = item.excludedIngredients || item.excluded_ingredients || [];
    const excludedIngredients = (Array.isArray(rawExcluded) ? rawExcluded : [])
      .map((excluded: any) =>
        typeof excluded === "string"
          ? { productId: "", name: excluded }
          : {
              productId: String(
                excluded?.productId?._id ||
                  excluded?.productId?.id ||
                  excluded?.productId ||
                  excluded?.id ||
                  excluded?._id ||
                  "",
              ),
              name: excluded?.name || excluded?.productName || "",
            },
      )
      .filter((excluded: { productId: string; name: string }) => excluded.name || excluded.productId);

    const rawProductId =
      (typeof item.productId === "string" ? item.productId : item.productId?._id || item.productId?.id) ||
      (typeof item.product === "string" ? item.product : item.product?._id || item.product?.id) ||
      product._id ||
      product.id ||
      item._id ||
      String(idx);

    return {
      id: item._id || rawProductId || String(idx),
      productId: rawProductId,
      name: item.name || product.name || item.productName || "Unknown Product",
      quantity: item.quantity || 0,
      unitPrice: item.price ?? product.price ?? 0,
      note: unmatchedNotes.join(", "),
      selectedVariants,
      selectedExtras,
      excludedIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
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

  const isStaffOrder = Boolean(
    o.billedToStaffId ||
    o.source === "staff" ||
    o.isStaffOrder ||
    (o.type || "").toLowerCase() === "staff"
  );

  const rawSource = (o.source || "").toLowerCase();
  let resolvedSource: OrderSource = "application";
  if (isStaffOrder || rawSource === "staff") {
    resolvedSource = "staff";
  } else if (rawSource === "pos") {
    resolvedSource = "pos";
  } else if (rawSource === "call" || o.type === "takeaway") {
    resolvedSource = "call";
  } else {
    resolvedSource = "application";
  }

  const staffName =
    (typeof o.billedToStaffId === "object" ? (o.billedToStaffId?.name || o.billedToStaffId?.fullName) : undefined) ||
    o.staffName;

  const staffPhone =
    (typeof o.billedToStaffId === "object" ? o.billedToStaffId?.phone : undefined) ||
    o.customerPhone;

  const customerName =
    staffName ||
    o.customerId?.name ||
    o.customer?.name ||
    o.customerName ||
    (isStaffOrder ? "Staff Member" : "Walk-in Customer");

  const customerPhone =
    staffPhone ||
    o.customerId?.phone ||
    o.customer?.phone ||
    o.customerPhone ||
    "";

  const staffStatus =
    o.staffStatus ||
    (paymentState === "Paid" || o.paymentStatus === "paid" || o.isPaid
      ? "Paid"
      : "Charged to tab");

  const creator =
    (o.staffId && typeof o.staffId === "object" ? o.staffId : null) ||
    (o.createdBy && typeof o.createdBy === "object" ? o.createdBy : null);
  const createdByName =
    creator?.name || creator?.fullName || o.createdByName || undefined;
  const createdByRole = creator?.role || o.createdByRole || undefined;

  const resolvedAddress =
    (typeof o.customer?.address === "string" ? o.customer.address : undefined) ||
    (typeof o.address === "string" ? o.address : undefined) ||
    (typeof o.deliveryAddress === "string" ? o.deliveryAddress : undefined) ||
    (typeof o.shippingAddress === "string" ? o.shippingAddress : undefined) ||
    (typeof o.customerId?.address === "string" ? o.customerId.address : undefined) ||
    (Array.isArray(o.customer?.addresses) && (o.customer.addresses.find((a: any) => a.isDefault) || o.customer.addresses[0])?.details) ||
    (Array.isArray(o.customer?.addresses) && (o.customer.addresses.find((a: any) => a.isDefault) || o.customer.addresses[0])?.address) ||
    (Array.isArray(o.customerId?.addresses) && (o.customerId.addresses.find((a: any) => a.isDefault) || o.customerId.addresses[0])?.details) ||
    (Array.isArray(o.customerId?.addresses) && (o.customerId.addresses.find((a: any) => a.isDefault) || o.customerId.addresses[0])?.address) ||
    "";

  return {
    id: o._id || o.id,
    orderId: o.orderId || null,
    customerName,
    customerPhone,
    customerEmail: o.customerId?.email || o.customer?.email || o.customerEmail || "",
    address: resolvedAddress || ((o.type || "").toLowerCase() === "takeaway" && resolvedSource !== "call" ? "Takeaway" : "In Store"),
    zone,
    date: dateStr,
    time: timeStr,
    createdAt: o.createdAt || undefined,
    createdByName,
    createdByRole,
    // `||` treats a legitimately-zero total (e.g. a coupon/discount that
    // fully covers the subtotal — a real, correct $0 order) as "missing"
    // and falls back to the pre-discount subtotal instead, showing the
    // full undiscounted amount for what should display as a free order.
    // `o.totalAmount` never actually exists on the backend schema (always
    // falls through to `o.total`), so `??` can't be masked by it the way
    // the discount field fix above needed `||`.
    total: o.totalAmount ?? o.total ?? subtotal,
    gross: o.gross ?? (o.subtotal || subtotal) + (o.tax || 0),
    subtotal: o.subtotal || subtotal,
    discount: o.discountAmount || o.discount || 0,
    discountType: o.discountType || undefined,
    discountValue: o.discountValue ?? undefined,
    deliveryFee: o.deliveryFee || 0,
    tax: o.tax || 0,
    status: mapOrderStatus(o.status, resolvedSource),
    category,
    source: resolvedSource,
    paymentMethod: o.paymentMethod || "Cash on delivery",
    paymentState,
    type: resolvedSource === "call" || rawSource === "call" || (o.deliveryFee && o.deliveryFee > 0) ? "delivery" : o.type,
    items,
    driver: o.assignedDriver?.name || o.driver || undefined,
    billedToStaffId: typeof o.billedToStaffId === "object" ? o.billedToStaffId?._id : o.billedToStaffId,
    isStaffOrder,
    staffName,
    staffStatus,
  };
};

export const mapOrders = (orders: any[]): Order[] => {
  return (orders || []).map(mapOrder);
};
