import { useMemo, useState } from "react";
import {
  CircleCheck,
  CircleX,
  Plus,
  Ticket,
  BadgeCheck,
  CircleCheckBig,
  CheckCheck,
} from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { MOCK_COUPONS } from "./data";
import type { Coupon } from "./types";
import CouponsTable from "./components/CouponsTable";
import CreateCouponDialog from "./components/CreateCouponDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Price (EGP)", value: "fixed" },
];

const CouponsPage = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

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

  const handleDeleteCoupon = (couponId: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  const handleStatusChange = (couponId: number, newStatus: boolean) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: newStatus } : c)),
    );
  };

  const handleSaveCoupon = (coupon: Coupon) => {
    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === editingCoupon.id ? coupon : c)),
      );
    } else {
      setCoupons((prev) => [...prev, coupon]);
    }
    setIsDialogOpen(false);
    setEditingCoupon(undefined);
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

      {/* Overview Cards */}
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

      {/* Search + Filter */}
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

      {/* Table */}
      <CouponsTable
        coupons={filtered}
        onStatusChange={handleStatusChange}
        onEdit={handleEditCoupon}
        onDelete={handleDeleteCoupon}
      />

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
