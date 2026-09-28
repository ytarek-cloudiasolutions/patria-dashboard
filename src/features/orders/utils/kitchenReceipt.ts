export interface KitchenReceiptItem {
  name: string;
  qty: number;
  options?: string[];
  extras?: string[];
  excluded?: string[];
  note?: string;
  category?: string;
}

export interface KitchenReceiptData {
  orderNumber: string;
  orderType: "dine-in" | "takeaway" | "delivery" | string;
  station?: string;
  tableNumber?: string;
  customerName?: string;
  date?: string;
  time?: string;
  brandName?: string;
  notes?: string;
  items: KitchenReceiptItem[];
}

export function generateKitchenReceiptHtml(data: KitchenReceiptData): string {
  const brand = data.brandName || "Patria Restaurant";
  const now = new Date();

  // Helper to ensure time is in English: e.g. "12:32 PM"
  const formatTimeEn = (timeStr?: string) => {
    if (!timeStr) {
      return now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return timeStr
      .replace(/\s*ص/g, " AM")
      .replace(/\s*م/g, " PM")
      .trim();
  };

  const formattedTime = formatTimeEn(data.time);

  // Clean and format order number: e.g. #ORD-968159
  const rawId = String(data.orderNumber || "").replace(/^[#\s]+|[#\s]+$/g, "").trim();
  const formattedOrderNumber = rawId.startsWith("ORD-")
    ? `#${rawId}`
    : `#ORD-${rawId}`;

  // Order type badge text in English
  const rawType = (data.orderType || "").toLowerCase();
  const isDineIn =
    rawType === "dine-in" ||
    rawType === "dine_in" ||
    rawType.includes("dine") ||
    rawType.includes("صالة");
  const isTakeaway =
    rawType === "takeaway" ||
    rawType.includes("takeaway") ||
    rawType.includes("تيك");
  const isDelivery =
    rawType === "delivery" ||
    rawType.includes("delivery") ||
    rawType.includes("توصيل");

  const tableVal = data.tableNumber
    ? String(data.tableNumber).replace(/table\s*/i, "").trim()
    : "";
  const hasTable = isDineIn && tableVal.length > 0 && tableVal !== "—";

  let orderTypeLabel = "Takeaway";
  if (isDineIn) {
    orderTypeLabel = hasTable ? `Dine-In (Table ${tableVal})` : "Dine-In";
  } else if (isDelivery) {
    orderTypeLabel = "Delivery";
  } else if (isTakeaway) {
    orderTypeLabel = "Takeaway";
  }

  // Station Badge: defaulted to KITCHEN as requested
  const stationName = data.station?.trim().toUpperCase() || "KITCHEN";

  // Calculate total items
  const totalItemsCount = data.items.reduce((sum, item) => sum + (item.qty || 1), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${brand} - Kitchen</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @page {
      size: 80mm auto;
      margin: 0;
    }
    @media print {
      html, body {
        width: 80mm !important;
        margin: 0 auto !important;
        padding: 4mm 6mm !important;
      }
    }
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      width: 76mm;
      max-width: 100%;
      margin: 0 auto;
      padding: 10px 8px 16px;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      direction: ltr;
    }

    /* Top Row: Station badge & Order number in a single line */
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      width: 100%;
      gap: 6px;
    }
    .station-badge {
      background-color: #000;
      color: #fff;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
      text-transform: uppercase;
      line-height: 1.2;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .order-number {
      font-size: 19px;
      font-weight: 900;
      color: #000;
      letter-spacing: -0.2px;
      text-align: right;
      line-height: 1.1;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Second Row: Order Type & Time */
    .second-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .order-type-badge {
      display: inline-block;
      border: 1.8px solid #000;
      border-radius: 4px;
      padding: 2px 7px;
      font-size: 12.5px;
      font-weight: 800;
      color: #000;
      line-height: 1.25;
      background: #fff;
    }
    .time-stamp {
      font-size: 13px;
      font-weight: 800;
      color: #000;
      display: flex;
      align-items: center;
      gap: 4px;
      line-height: 1.2;
    }

    /* Divider */
    .divider {
      border-bottom: 2px solid #000;
      margin: 6px 0 10px;
      width: 100%;
    }

    /* Items List */
    .items-container {
      margin: 4px 0;
    }
    .item-block {
      margin-bottom: 10px;
    }
    .item-block:last-child {
      margin-bottom: 4px;
    }
    .item-header {
      font-size: 16px;
      font-weight: 900;
      line-height: 1.25;
      color: #000;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .item-qty {
      font-size: 17px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .item-name {
      font-size: 16px;
      font-weight: 900;
      word-break: break-word;
    }
    .item-modifiers {
      margin-left: 20px;
      margin-top: 2px;
      font-size: 11.5px;
      font-weight: 700;
      color: #000;
      line-height: 1.4;
    }
    .mod-line {
      display: block;
    }

    /* Order Note Box */
    .order-note-box {
      border: 1.8px solid #000;
      padding: 5px 8px;
      margin-top: 8px;
      margin-bottom: 2px;
      font-size: 13.5px;
      font-weight: 900;
      color: #000;
      line-height: 1.25;
      word-break: break-word;
      background: #fff;
    }

    /* Bottom Total */
    .bottom-divider {
      border-top: 2px solid #000;
      margin: 10px 0 6px;
      width: 100%;
    }
    .total-items {
      font-size: 13px;
      font-weight: 900;
      color: #000;
      text-align: left;
    }
  </style>
</head>
<body>
  <!-- Header: Station & Order Number -->
  <div class="top-row">
    <div class="station-badge">${stationName}</div>
    <div class="order-number">${formattedOrderNumber}</div>
  </div>

  <!-- Second Row: Type Badge & Time -->
  <div class="second-row">
    <div class="order-type-badge">${orderTypeLabel}</div>
    <div class="time-stamp">⏰ ${formattedTime}</div>
  </div>

  <!-- Header Divider -->
  <div class="divider"></div>

  <!-- Items -->
  <div class="items-container">
    ${data.items
      .map((item) => {
        // Collect all modifiers
        const modLines: string[] = [];

        if (item.options && item.options.length > 0) {
          // Check if multiple options can be grouped or listed with ▪
          modLines.push(...item.options.map((opt) => `▪ ${opt}`));
        }
        if (item.extras && item.extras.length > 0) {
          modLines.push(...item.extras.map((ext) => `▪ Extra: ${ext.replace(/^\+\s*/, "")}`));
        }
        if (item.excluded && item.excluded.length > 0) {
          modLines.push(...item.excluded.map((ex) => `▪ Without: ${ex}`));
        }
        if (item.note) {
          modLines.push(`▪ Note: ${item.note}`);
        }

        return `
          <div class="item-block">
            <div class="item-header">
              <span class="item-qty">${item.qty}×</span>
              <span class="item-name">${item.name}</span>
            </div>
            ${
              modLines.length > 0
                ? `<div class="item-modifiers">${modLines
                    .map((m) => `<div class="mod-line">${m}</div>`)
                    .join("")}</div>`
                : ""
            }
          </div>
        `;
      })
      .join("")}
  </div>

  ${
    data.notes && data.notes.trim()
      ? `<div class="order-note-box">Note: ${data.notes.trim()}</div>`
      : ""
  }

  <!-- Bottom Divider & Total -->
  <div class="bottom-divider"></div>
  <div class="total-items">Total: ${totalItemsCount} items</div>
</body>
</html>`;
}
