import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import { api } from "@/config/api";
import {
  DollarSign,
  ShoppingBag,
  Banknote,
  CreditCard,
} from "lucide-react";
import type { OrderType } from "../types";

const TH = "px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#28293D] text-left";
const TD = "px-4 py-4 text-[14px] text-[#28293D]";

interface OrderSummary {
  totalRevenue: number;
  totalOrders: number;
  cash: number;
  cards: number;
}

interface OrderRow {
  id: string;
  orderId: string;
  date: string;
  type: string;
  status: string;
  total: number;
  payment: string;
  itemsCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-[rgba(254,154,0,0.1)] text-[#C7861E] border border-[#C7861E]",
  Preparing: "bg-[#F5F0EA] text-[#8F6900] border border-[#725400]",
  Confirmed: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  "On The Way": "bg-[#F3E9FA] text-[#9524E4] border border-[#7E00D7]",
  Delivered: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  Cancelled: "bg-[#C90000] text-white border border-[#C90000]",
};

interface OrdersReportTabProps {
  fromDate: string;
  toDate: string;
  orderType: OrderType;
  onInitialLoadComplete?: () => void;
}

const OrdersReportTab = ({ fromDate, toDate, orderType, onInitialLoadComplete }: OrdersReportTabProps) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (orderType !== "All Types") params.type = orderType;

    api
      .get("/reports/orders", { params })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? {};
        setSummary(data.summary ?? null);
        setOrders(data.orders ?? []);
      })
      .catch(() => {
        setSummary(null);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
        onInitialLoadComplete?.();
      });
  }, [fromDate, toDate, orderType]);

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      t("ID"),
      t("Date"),
      t("Type"),
      t("Status"),
      t("Total"),
      t("Payment"),
      t("Items"),
    ];
    const rows = orders.map((o) => [
      o.orderId,
      o.date,
      o.type,
      o.status,
      `EGP ${o.total.toFixed(2)}`,
      o.payment,
      String(o.itemsCount),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Total Revenue"),
            value: summary
              ? `EGP ${summary.totalRevenue.toLocaleString()}`
              : "—",
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-primary",
            icon: <DollarSign className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total Orders"),
            value: summary ? String(summary.totalOrders) : "—",
            badgeColor: "bg-[#EDF4FB]",
            iconColor: "text-blue-500",
            icon: <ShoppingBag className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Cash"),
            value: summary
              ? `EGP ${summary.cash.toLocaleString()}`
              : "—",
            badgeColor: "bg-[rgba(254,154,0,0.1)]",
            iconColor: "text-[#C7861E]",
            icon: <Banknote className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Cards"),
            value: summary
              ? `EGP ${summary.cards.toLocaleString()}`
              : "—",
            badgeColor: "bg-[#F3E9FA]",
            iconColor: "text-[#9524E4]",
            icon: <CreditCard className="size-5" />,
          }}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-5 sm:px-5">
          <span className="text-[18px] font-bold text-[#333333]">
            {t("Order Details")}
          </span>
          <DefaultButton
            data={{
              buttonText: t("Export CSV"),
              onClick: handleExportCSV,
              icon: <FileDown className="size-4.5" />,
              className: "bg-primary text-white hover:bg-primary/90",
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={TH}>{t("ID")}</th>
                <th className={`${TH} text-center`}>{t("Date")}</th>
                <th className={`${TH} text-center`}>{t("Type")}</th>
                <th className={`${TH} text-center`}>{t("Status")}</th>
                <th className={`${TH} text-center`}>{t("Total")}</th>
                <th className={`${TH} text-center`}>{t("Payment")}</th>
                <th className={`${TH} text-center`}>{t("Items")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("Loading...")}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("No orders found")}
                  </td>
                </tr>
              ) : (
                orders.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[#E5E5E5] hover:bg-[#FAFAF7] transition-colors"
                  >
                    <td className={`${TD} font-bold text-[12px]`}>
                      {row.orderId}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {row.date}
                    </td>
                    <td className={`${TD} text-center text-[#28293D]`}>
                      {t(row.type)}
                    </td>
                    <td className={`${TD} text-center`}>
                      <span
                        className={`inline-flex items-center rounded-[30px] px-3 py-1 text-[13px] font-medium ${
                          STATUS_STYLES[row.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {t(row.status)}
                      </span>
                    </td>
                    <td className={`${TD} text-center font-bold`} dir="ltr">
                      EGP {row.total.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center`}>{t(row.payment)}</td>
                    <td className={`${TD} text-center`}>
                      <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#F5F0EA] px-3 py-1 text-[12px] font-medium text-[#000000]">
                        <strong>{row.itemsCount}</strong> {t("Products")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrdersReportTab;
