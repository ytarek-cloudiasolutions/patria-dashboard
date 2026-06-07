import { AlertTriangle, ChartColumn } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { InventoryItem, UrgencyLevel } from "../types";

const URGENCY_STYLES: Record<UrgencyLevel, string> = {
  Critical: "bg-[#FFF0F0] text-[#C90000] border-[#C90000]",
  Good: "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]",
  "Sufficient stock": "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
};

const getDaysRemainingStyle = (days: number | null) => {
  if (days === null) return "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]";
  if (days <= 7) return "bg-[#FFF0F0] text-[#C90000] border-[#C90000]";
  if (days <= 30) return "bg-[#FFF8E6] text-[#D97706] border-[#D97706]";
  return "bg-[#dcdcdc] text-[#23252a] border-[#595959]";
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)}/${parseInt(month)}/${year}`;
};

interface ExpectedShortagesTableProps {
  items: InventoryItem[];
}

const ExpectedShortagesTable = ({ items }: ExpectedShortagesTableProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full overflow-hidden rounded-[16px] border border-[#E5E5E5]">
      <div className="flex items-center gap-3 bg-white px-5 py-4">
        <ChartColumn className="size-[18px] shrink-0" />
        <span className="font-semibold text-[14px] text-[#333333]">
          {t("Stockout forecast based on sales rate (last 30 days)")}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="ps-5 py-4 text-start">
                {t("PRODUCT")}
              </TableHead>
              <TableHead className="text-center">
                {t("CURRENT QUANTITY")}
              </TableHead>
              <TableHead className="text-center">
                {t("SALES RATE/DAY")}
              </TableHead>
              <TableHead className="text-center">
                {t("DAYS REMAINING")}
              </TableHead>
              <TableHead className="text-center">
                {t("EXPECTED EXPIRY DATE")}
              </TableHead>
              <TableHead className="pe-5 text-center">
                {t("URGENCY LEVEL")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No items found.")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="ps-5 py-4">
                    <span className="text-[14px] font-normal text-[#333333]">
                      {item.name}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-[14px] font-medium text-black">
                      {item.currentQuantity}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-[14px] font-medium text-black">
                      {item.salesRatePerDay !== null
                        ? item.salesRatePerDay
                        : "-"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      className={`h-6 px-3 rounded-[30px] text-[11px] font-normal border ${getDaysRemainingStyle(
                        item.daysRemaining,
                      )}`}
                    >
                      {item.daysRemaining !== null
                        ? `${item.daysRemaining} ${t("Days")}`
                        : t("Stable")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-[14px] font-medium text-black">
                      {formatDate(item.expectedExpiryDate)}
                    </span>
                  </TableCell>

                  <TableCell className="pe-5 text-center">
                    <Badge
                      className={`h-6 px-3 rounded-[30px] text-[11px] font-normal border gap-1 ${
                        URGENCY_STYLES[item.urgencyLevel]
                      }`}
                    >
                      {item.urgencyLevel === "Critical" && (
                        <AlertTriangle className="size-3 shrink-0" />
                      )}
                      {t(item.urgencyLevel)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
};

export default ExpectedShortagesTable;
