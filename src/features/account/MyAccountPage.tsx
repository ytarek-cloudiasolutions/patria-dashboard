import { useEffect, useState } from "react";
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
      .catch(() => {});
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
      .catch(() => {});
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

  return (
    <>
      <div className="mb-6">
        <HeaderLayout
          title={t("Order reports")}
          description={t("Filter by date and export to Excel")}
        />
      </div>

      <AccountDateRange value={dateRange} onChange={setDateRange} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[322px_1fr]">
        <AccountSettingsCard
          form={form}
          onChange={handleChange}
          onSave={handleSave as any}
        />

        <div className="flex flex-col gap-4">
          <AccountStats
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
          />
          <OrderReportsTable
            orders={orderReports}
            count={totalOrders}
          />
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
