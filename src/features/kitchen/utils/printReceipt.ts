import { generateKitchenReceiptHtml } from "@/features/orders/utils/kitchenReceipt";
import { printHtmlInCurrentTab } from "@/shared/lib/printHtml";
import type { KitchenOrder } from "../store/kitchenTypes";
import { formatKitchenOrderId } from "./orderUtils";

function getCustomerName(order: KitchenOrder): string {
  if (!order.customer) return "Walk-in";
  if (typeof order.customer === "string") return order.customer;
  return order.customer.name ?? "Walk-in";
}

export function printKitchenOrderReceipt(order: KitchenOrder, stationName?: string): void {
  const now = new Date();
  const printTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const printDate = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });

  const rawType = (order.type || "").toLowerCase();
  const isCall = (order as any).source === "call" || rawType === "call";
  const rawAddr = typeof order.customer === "object" ? order.customer?.address || "" : "";
  const isDineIn = !isCall && (rawType === "dine_in" || rawType === "dine-in" || rawAddr.toLowerCase().includes("table"));
  const isTakeaway = !isCall && (rawType === "takeaway" || rawAddr.toLowerCase() === "takeaway");
  const isDelivery = isCall || rawType === "delivery" || (!isDineIn && !isTakeaway && !!rawAddr && rawAddr !== "In Store" && rawAddr !== "Takeaway");

  const tableOrAddressText = isDineIn
    ? (order.table || (rawAddr && rawAddr !== "In Store" && rawAddr !== "Takeaway" ? rawAddr : ""))
    : isDelivery
      ? rawAddr
      : "";

  const displayId = formatKitchenOrderId(order);

  const receiptHtml = generateKitchenReceiptHtml({
    orderNumber: String(displayId),
    orderType: isDineIn ? "dine-in" : isTakeaway ? "takeaway" : isDelivery ? "delivery" : "dine-in",
    station: stationName || "KITCHEN",
    tableNumber: tableOrAddressText,
    customerName: getCustomerName(order),
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })
      : printDate,
    time: order.createdAt
      ? new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      : printTime,
    brandName: "Patria Restaurant",
    items: order.items.map((item: any) => {
      const productName = typeof item.productId === "object" ? item.productId?.name : undefined;
      const itemName = item.name || productName || "Item";
      const options: string[] = [];
      if (Array.isArray(item.selectedVariants)) {
        options.push(...item.selectedVariants.map((v: any) => `${v.group || v.name}: ${v.option}`));
      } else if (Array.isArray(item.variants)) {
        options.push(...item.variants.map((v: any) => `${v.group || v.name}: ${v.option}`));
      }
      const extras: string[] = [];
      if (Array.isArray(item.selectedExtras)) {
        extras.push(...item.selectedExtras.map((e: any) => `+ ${e.name}`));
      } else if (Array.isArray(item.extras)) {
        extras.push(...item.extras.filter((e: any) => e.selected || typeof e.selected === "undefined").map((e: any) => `+ ${e.name}`));
      }
      const excluded: string[] = item.excludedIngredients || item.excluded_ingredients || [];
      return {
        name: itemName,
        qty: item.quantity || 1,
        options,
        extras,
        excluded,
        note: item.notes || item.note || undefined,
      };
    }),
  });

  printHtmlInCurrentTab(receiptHtml);
}

export function openSystemPrintDialog(kitchenName = "Kitchen"): void {
  const now = new Date();
  const printTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const printDate = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });

  const receiptHtml = generateKitchenReceiptHtml({
    orderNumber: "TEST",
    orderType: "takeaway",
    station: kitchenName.toUpperCase(),
    date: printDate,
    time: printTime,
    brandName: "Patria Kitchen",
    items: [
      {
        name: "Test Print",
        qty: 1,
      },
    ],
  });

  printHtmlInCurrentTab(receiptHtml);
}



