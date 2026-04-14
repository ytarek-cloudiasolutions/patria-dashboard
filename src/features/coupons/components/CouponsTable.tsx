import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, Copy, Edit, Search, Trash } from "lucide-react";
import Switch from "@/shared/components/ui/switch";
import type { CouponProps } from "../types";

const CouponsTable = forwardRef<
  {
    addCoupon: (coupon: CouponProps) => void;
    updateCoupon: (coupon: CouponProps) => void;
  },
  { onEdit: (coupon: CouponProps) => void }
>(({ onEdit }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Categories");

  const [coupons, setCoupons] = useState<CouponProps[]>([
    {
      id: 1,
      code: "WELCOME20",
      discountType: "Fixed",
      discountValue: 50,
      usageCount: 2,
      usageLimit: undefined,
      startDate: "2026-04-07",
      endDate: "2026-04-14",
      isActive: true,
    },
    {
      id: 2,
      code: "RMDKAREEM",
      discountType: "Percentage",
      discountValue: 20,
      minOrderFee: 85,
      usageCount: 2,
      usageLimit: 20,
      startDate: "2026-04-07",
      endDate: "2026-04-14",
      isActive: false,
    },
    {
      id: 3,
      code: "FIRST30",
      discountType: "Percentage",
      discountValue: 30,
      minOrderFee: 150,
      usageCount: 10,
      usageLimit: undefined,
      startDate: "2026-04-07",
      endDate: "2026-04-14",
      isActive: true,
    },
  ]);

  useImperativeHandle(ref, () => ({
    addCoupon: (coupon: CouponProps) => {
      setCoupons((prev) => [coupon, ...prev]);
    },
    updateCoupon: (coupon: CouponProps) => {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
    },
  }));

  const types = ["All Categories", "Fixed", "Percentage"];

  // ✅ Formatters
  const formatDiscountType = (type: CouponProps["discountType"]) =>
    type === "Fixed" ? "Fixed Price (EGP)" : "Percentage (%)";

  const formatDiscountValue = (coupon: CouponProps) =>
    coupon.discountType === "Fixed"
      ? `EGP ${coupon.discountValue.toFixed(2)}`
      : `${coupon.discountValue}%`;

  const formatCurrency = (value?: number) =>
    value ? `EGP ${value.toFixed(2)}` : "-";

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

  // ✅ Actions
  const handleToggle = (id: number, checked: boolean) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, isActive: checked } : coupon
      )
    );
  };

  const handleDelete = (id: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // ✅ Filter
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
      {/* Search + Filter */}
      <div className="flex items-center gap-8 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-lg border border-[#cacbd4]">
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[16px] text-[#8b8b8b] focus:outline-none"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="w-80">
          <div className="flex items-center gap-3 bg-white px-4.5 py-3 rounded-xl border border-neutral-200">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-transparent appearance-none focus:outline-none"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "Fixed"
                    ? "Fixed Price (EGP)"
                    : type === "Percentage"
                    ? "Percentage (%)"
                    : type}
                </option>
              ))}
            </select>
            <ChevronDown className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CODE</TableHead>
            <TableHead>DISCOUNT TYPE</TableHead>
            <TableHead>DISCOUNT VALUE</TableHead>
            <TableHead>MINMUM ORDER FEE</TableHead>
            <TableHead>NO. OF USAGE</TableHead>
            <TableHead>DURATION</TableHead>
            <TableHead className="flex justify-center items-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCoupons.map((coupon) => (
            <TableRow key={coupon.id} className="h-16">
              <TableCell className="font-medium flex items-center gap-2">
                {coupon.code}
                <Copy
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => handleCopyCode(coupon.code)}
                />
              </TableCell>

              <TableCell>{formatDiscountType(coupon.discountType)}</TableCell>

              <TableCell>{formatDiscountValue(coupon)}</TableCell>

              <TableCell>{formatCurrency(coupon.minOrderFee)}</TableCell>

              <TableCell>
                {formatUsage(coupon.usageCount, coupon.usageLimit)}
              </TableCell>

              <TableCell>
                {formatDateRange(coupon.startDate, coupon.endDate)}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={coupon.isActive}
                    onCheckedChange={(checked) =>
                      handleToggle(coupon.id, checked)
                    }
                  />

                  <Edit
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => onEdit(coupon)}
                  />

                  <Trash
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => {
                      if (window.confirm(`Delete coupon "${coupon.code}"?`)) {
                        handleDelete(coupon.id);
                      }
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

CouponsTable.displayName = "CouponsTable";

export default CouponsTable;
