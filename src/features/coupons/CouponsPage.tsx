import { useEffect, useMemo, useState } from "react";
import {
  CircleX,
  Plus,
  Ticket,
  CircleCheckBig,
  CheckCheck,
} from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { api } from "@/config/api";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type { Coupon } from "./types";
import CouponsTable from "./components/CouponsTable";
import CreateCouponDialog from "./components/CreateCouponDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Price (EGP)", value: "fixed" },
];

const mapCoupon = (c: any, idx: number): Coupon => ({
  id: c._id ?? idx,
  code: c.code ?? "",
  discountType: c.discountType ?? "percentage",
  discountValue: c.discountValue ?? 0,
  minOrderAmount: c.minOrderAmount ?? 0,
  usageLimit: c.maxUses ?? 0,
  usedCount: c.usedCount ?? 0,
  startDate: c.startDate ? c.startDate.split("T")[0] : "",
  endDate: c.expiryDate ? c.expiryDate.split("T")[0] : "",
  isActive: c.isActive ?? true,
});

const CouponsPage = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    api
      .get("/coupons", { params: { limit: 100 } })
      .then((res) => {
        const raw: any[] = res.data?.data ?? res.data?.coupons ?? [];
        setCoupons(raw.map(mapCoupon));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const stats = useMemo(
    () => ({
      active: coupons.filter((c) => c.isActive).length,
      usageTimes: coupons.reduce((sum, c) => sum + c.usedCount, 0),
      total: coupons.length,
      inactive: coupons.filter((c) => !c.isActive).length,
    }),
    [coupons],
  );

  const filtered = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || c.discountType === category;
      return matchesSearch && matchesCategory;
    });
  }, [coupons, search, category]);

  const handleOpenCreateDialog = () => {
    setEditingCoupon(undefined);
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleDeleteCoupon = async (couponId: number) => {
    try {
      await api.delete(`/coupons/${couponId}`);
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      showSuccessToast(t("Coupon deleted"));
    } catch {
      showErrorToast(t("Failed to delete coupon"));
    }
  };

  const handleStatusChange = async (couponId: number, newStatus: boolean) => {
    try {
      const coupon = coupons.find((c) => c.id === couponId);
      if (!coupon) return;
      await api.put(`/coupons/${couponId}`, {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        isActive: newStatus,
      });
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, isActive: newStatus } : c)),
      );
    } catch {
      showErrorToast(t("Failed to update coupon"));
    }
  };

  const handleSaveCoupon = async (coupon: Coupon) => {
    try {
      const payload = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxUses: coupon.usageLimit || undefined,
        startDate: coupon.startDate || undefined,
        expiryDate: coupon.endDate || undefined,
        isActive: coupon.isActive,
      };

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, payload);
        showSuccessToast(t("Coupon updated"));
      } else {
        await api.post("/coupons", payload);
        showSuccessToast(t("Coupon created"));
      }
      fetchCoupons();
      setIsDialogOpen(false);
      setEditingCoupon(undefined);
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message ?? t("Failed to save coupon"));
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("Coupons")}
          description={t(
            "Customer discount code management and mobile application",
          )}
        />
        <DefaultButton
          data={{
            buttonText: t("Create a coupon"),
            onClick: handleOpenCreateDialog,
            icon: <Plus className="size-4.5" />,
          }}
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Active Coupons"),
            value: stats.active,
            badgeColor: "bg-[#DCFCE7]",
            iconColor: "text-[#16A34A]",
            icon: <CircleCheckBig className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Usage times"),
            value: stats.usageTimes,
            badgeColor: "bg-[#DBEAFE]",
            iconColor: "text-[#2563EB]",
            icon: <CheckCheck className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total No. of Coupons"),
            value: stats.total,
            badgeColor: "bg-[#FE9A001A]",
            iconColor: "text-[#C7861E]",
            icon: <Ticket className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Inactive Coupons"),
            value: stats.inactive,
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
            icon: <CircleX className="size-5" />,
          }}
        />
      </div>

      {isCategoryMenuOpen && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/50" />
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInputField
          value={search}
          onChange={setSearch}
          placeholder={t("Search products...")}
          className="flex-1"
        />
        <DropdownSelect
          options={CATEGORY_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
          selected={category}
          onSelect={setCategory}
          onOpenChange={setIsCategoryMenuOpen}
          align="end"
          className="sm:w-52"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-[13px] text-[#8B8B8B]">{t("Loading...")}</p>
      ) : (
        <CouponsTable
          coupons={filtered}
          onStatusChange={handleStatusChange}
          onEdit={handleEditCoupon}
          onDelete={handleDeleteCoupon}
        />
      )}

      <CreateCouponDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveCoupon={handleSaveCoupon}
        editingCoupon={editingCoupon}
      />
    </>
  );
};

export default CouponsPage;
