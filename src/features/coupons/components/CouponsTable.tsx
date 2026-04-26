import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Copy, SquarePen, Trash2 } from "lucide-react";

import type { CouponProps } from "../types";
import { Switch } from "@/shared/components/ui/switch";
import CouponsFilters, { type CouponTypeFilter } from "./CouponsFilters";
import ActionButton from "@/shared/components/ActionButton";
import { MOCK_COUPONS } from "../data";

const CouponsTable = forwardRef<
  {
    addCoupon: (coupon: CouponProps) => void;
    updateCoupon: (coupon: CouponProps) => void;
    deleteCoupon: (couponId: number) => void;
  },
  {
    onEdit: (coupon: CouponProps) => void;
    onDelete: (coupon: CouponProps) => void;
  }
>(({ onEdit, onDelete }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] =
    useState<CouponTypeFilter>("All Categories");

  const [coupons, setCoupons] = useState<CouponProps[]>(MOCK_COUPONS);

  useImperativeHandle(ref, () => ({
    addCoupon: (coupon: CouponProps) => {
      setCoupons((prev) => [coupon, ...prev]);
    },
    updateCoupon: (coupon: CouponProps) => {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
    },
    deleteCoupon: (couponId: number) => {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    },
  }));

  const formatDiscountType = (type: CouponProps["discountType"]) =>
    type === "Fixed" ? "Fixed Price (EGP)" : "Percentage (%)";

  const formatDiscountValue = (coupon: CouponProps) =>
    coupon.discountType === "Fixed"
      ? (
          <>
            EGP <span className="font-semibold">{coupon.discountValue.toFixed(2)}</span>
          </>
        )
      : (
          <>
            <span className="font-semibold">{coupon.discountValue}</span>%
          </>
        );

  const formatCurrency = (value?: number) =>
    value ? (
      <>
        EGP <span className="font-semibold">{value.toFixed(2)}</span>
      </>
    ) : (
      "-"
    );

  const formatUsage = (used: number, limit?: number) =>
    `${used} / ${limit ?? "∞"}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateRange = (start: string, end: string) =>
    `${formatDate(start)} - ${formatDate(end)}`;

  const handleToggle = (id: number, checked: boolean) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, isActive: checked } : coupon
      )
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "All Categories" || coupon.discountType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col mt-6">
      <CouponsFilters
        searchValue={searchTerm}
        selectedType={selectedType}
        onSearchChange={setSearchTerm}
        onTypeChange={setSelectedType}
      />

      {/* Table */}
      <Table>
        <colgroup>
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
          <col style={{ width: "132px" }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>CODE</TableHead>
            <TableHead>DISCOUNT TYPE</TableHead>
            <TableHead>DISCOUNT VALUE</TableHead>
            <TableHead>MINMUM ORDER FEE</TableHead>
            <TableHead>NO. OF USAGE</TableHead>
            <TableHead>DURATION</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCoupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-bold">
                  <div className="flex items-center gap-2">
                    {coupon.code}
                    <Copy
                      className="size-4 text-[#000000] cursor-pointer hover:text-gray-900"
                      onClick={() => handleCopyCode(coupon.code)}
                    />
                  </div>
                </TableCell>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                  {formatDiscountType(coupon.discountType)}
                </TableCell>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                  {formatDiscountValue(coupon)}
                </TableCell>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                  {formatCurrency(coupon.minOrderFee)}
                </TableCell>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                  {formatUsage(coupon.usageCount, coupon.usageLimit)}
                </TableCell>
                <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                  {formatDateRange(coupon.startDate, coupon.endDate)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-4.5">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={(checked) =>
                        handleToggle(coupon.id, checked)
                      }
                    />
                    <ActionButton
                      data={{
                        icon: <SquarePen className="size-4.5" />,
                        iconColor: "text-[#000000]",
                        ariaLabel: "Edit coupon",
                        onClick: () => onEdit(coupon),
                      }}
                    />
                    <ActionButton
                      data={{
                        icon: <Trash2 className="size-4.5" />,
                        iconColor: "text-[#C90000]",
                        ariaLabel: "Delete coupon",
                        onClick: () => onDelete(coupon),
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

CouponsTable.displayName = "CouponsTable";

export default CouponsTable;
