import { useState, useMemo } from "react";
import { Search, BarChart2, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type { ShortageProduct } from "../types";

interface ExpectedShortagesTabProps {
  products: ShortageProduct[];
}

const DaysRemainingBadge = ({
  days,
  urgency,
}: {
  days: number | null;
  urgency: ShortageProduct["urgencyLevel"];
}) => {
  if (days === null) {
    return (
      <span className="rounded-full border border-[#A8DFC4] bg-white px-4 py-1.5 text-[12px] font-semibold text-[#1A7A45]">
        Stable
      </span>
    );
  }

  const isCritical = urgency === "Critical";
  return (
    <span
      className={cn(
        "rounded-full px-4 py-1.5 text-[12px] font-semibold",
        isCritical
          ? "border border-[#F5A8A8] bg-white text-[#C90000]"
          : "bg-[#EDEAE4] text-[#6B6B6B]"
      )}
    >
      {days} Days
    </span>
  );
};

const UrgencyBadge = ({
  level,
}: {
  level: ShortageProduct["urgencyLevel"];
}) => {
  const styles: Record<ShortageProduct["urgencyLevel"], string> = {
    Critical: "border border-[#F5A8A8] bg-white text-[#C90000]",
    Good: "border border-[#F5D8A8] bg-white text-[#B56C00]",
    "Sufficient stock": "border border-[#A8DFC4] bg-white text-[#1A7A45]",
  };

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold w-fit",
        styles[level]
      )}
    >
      {level === "Critical" && <AlertTriangle size={11} />}
      {level}
    </span>
  );
};

const ExpectedShortagesTab = ({ products }: ExpectedShortagesTabProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-3">
        <Search size={16} className="shrink-0 text-[#AAAAAA]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 py-3 whitespace-nowrap" colSpan={6}>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#28293D]">
                <BarChart2 size={15} />
                Stockout forecast based on sales rate (last 30 days)
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              PRODUCT
            </TableHead>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              CURRENT QUANTITY
            </TableHead>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              SALES RATE/DAY
            </TableHead>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              DAYS REMAINING
            </TableHead>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              EXPECTED EXPIRY DATE
            </TableHead>
            <TableHead className="px-5 py-3 whitespace-nowrap">
              URGENTNESS LEVEL
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((product) => (
            <TableRow key={product.id} className="hover:bg-[#FAFAF8]">
              <TableCell className="px-5 py-4 whitespace-nowrap font-semibold text-[14px] text-[#28293D]">
                {product.name}
              </TableCell>
              <TableCell className="px-5 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                {product.currentQuantity}
              </TableCell>
              <TableCell className="px-5 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                {product.salesRatePerDay !== null
                  ? product.salesRatePerDay
                  : "-"}
              </TableCell>
              <TableCell className="px-5 py-4 whitespace-nowrap">
                <DaysRemainingBadge
                  days={product.daysRemaining}
                  urgency={product.urgencyLevel}
                />
              </TableCell>
              <TableCell className="px-5 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                {product.expectedExpiryDate ?? "-"}
              </TableCell>
              <TableCell className="px-5 py-4 whitespace-nowrap">
                <UrgencyBadge level={product.urgencyLevel} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpectedShortagesTab;
