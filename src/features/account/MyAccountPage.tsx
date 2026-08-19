import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { api } from "@/config/api";
import { useTranslation } from "@/shared/i18n/useTranslation";
import {
  showErrorToast,
  showSuccessToast,
} from "@/shared/utils/toast";

import AccountDateRange from "./components/AccountDateRange";
import AccountSettingsCard from "./components/AccountSettingsCard";
import AccountStats from "./components/AccountStats";
import OrderReportsTable from "./components/OrderReportsTable";

import { DEFAULT_ACCOUNT } from "./data";
import type {
  AccountDateRange as AccountDateRangeType,
  AccountFormData,
  OrderReport,
} from "./types";

const mapOrderStatus = (s: string): OrderReport["status"] => {
  switch ((s ?? "").toLowerCase()) {
    case "confirmed": return "Confirmed";
    case "delivered": return "Delivered";
    case "on the way": case "on_the_way": return "On the Way";
    case "cancelled": case "canceled": return "Cancelled";
    default: return "Pending";
  }
};

const MyAccountPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<AccountFormData>(DEFAULT_ACCOUNT);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [orderReports, setOrderReports] = useState<OrderReport[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dateRange, setDateRange] = useState<AccountDateRangeType>({
    from: "",
    to: "",
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // Load current user profile on mount
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUserId(data._id ?? null);
        setForm({
          fullName: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          shipmentAddress: "",
        });
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, []);

  // Fetch orders for the stats table
  useEffect(() => {
    const params: Record<string, string> = { limit: "50" };
    if (dateRange.from) params.from = dateRange.from;
    if (dateRange.to) params.to = dateRange.to;
    api
      .get("/orders", { params })
      .then((res) => {
        const raw: any[] = res.data?.data ?? res.data?.orders ?? [];
        const pagination = res.data?.pagination;
        setTotalOrders(pagination?.total ?? raw.length);
        setTotalRevenue(raw.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0));
        const mapped: OrderReport[] = raw.map((o: any, idx: number) => {
          const name =
            typeof o.customer === "string"
              ? o.customer
              : o.customer?.name ?? "Walk-in";
          return {
            id: idx + 1,
            orderNo: o.orderId ? `#${o.orderId}` : `#${o._id?.slice(-6).toUpperCase()}`,
            customer: name,
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleDateString("en-US")
              : "—",
            status: mapOrderStatus(o.status),
            total: o.total ?? null,
          };
        });
        setOrderReports(mapped);
      })
      .catch(() => {})
      .finally(() => setOrdersLoaded(true));
  }, [dateRange]);

  const handleChange = (key: keyof AccountFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await api.put(`/users/${userId}`, {
        name: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
      });
      showSuccessToast(t("Profile updated successfully"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to update profile");
      showErrorToast(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadExcel = () => {
    if (orderReports.length === 0) {
      showErrorToast(t("No order reports available to download"));
      return;
    }

    const headers = [
      t("ORDER NO."),
      t("CUSTOMER"),
      t("DATE"),
      t("STATUS"),
      t("TOTAL"),
    ];

    const rows = orderReports.map((order) => [
      `"${(order.orderNo || "").replace(/"/g, '""')}"`,
      `"${(order.customer || "").replace(/"/g, '""')}"`,
      `"${order.date || ""}"`,
      `"${t(order.status)}"`,
      `"${order.total !== null ? `EGP ${order.total.toFixed(2)}` : "-"}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.map((h) => `"${h}"`), ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Order_Reports_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccessToast(t("Order reports exported successfully"));
  };

  const isLoading = !profileLoaded || !ordersLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <UserCircle className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <HeaderLayout
          title={t("Order reports")}
          description={t("Filter by date and export to Excel")}
        />
      </div>

      <AccountDateRange value={dateRange} onChange={setDateRange} />

      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[300px_1fr]">
        <AccountSettingsCard
          form={form}
          onChange={handleChange}
          onSave={handleSave as any}
        />

        <div className="flex w-full min-w-0 flex-col gap-4">
          <AccountStats
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
          />
          <OrderReportsTable
            orders={orderReports}
            count={totalOrders}
            onDownload={handleDownloadExcel}
          />
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
