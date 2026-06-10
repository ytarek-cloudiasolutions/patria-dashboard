import {
  Activity,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { PerformanceIndicator } from "../types";

interface PerformanceIndicatorsCardProps {
  rows: PerformanceIndicator[];
}

const ICONS: Record<string, { Icon: LucideIcon; color: string; bg: string }> = {
  "Total orders": {
    Icon: ShoppingBag,
    color: "text-primary",
    bg: "bg-[#F5F0EA]",
  },
  "Net Profit": {
    Icon: Wallet,
    color: "text-[#C90000]",
    bg: "bg-[#FFF0F0]",
  },
  Salaries: { Icon: Users, color: "text-[#155DFC]", bg: "bg-[#DBEAFE]" },
  "Operating Expenses": {
    Icon: DollarSign,
    color: "text-[#C7861E]",
    bg: "bg-[#FFF7E6]",
  },
  "Avg. Order Value": {
    Icon: Wallet,
    color: "text-[#9524E4]",
    bg: "bg-[#F3E9FA]",
  },
};

const FALLBACK = {
  Icon: Activity,
  color: "text-[#28293D]",
  bg: "bg-[#F5F0EA]",
};

const formatEgp = (value: number) =>
  `EGP ${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const PerformanceIndicatorsCard = ({
  rows,
}: PerformanceIndicatorsCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="h-full rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <CardContent className="flex h-full flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={25} className="text-[#000000]" />
          <h3 className="text-[18px] font-semibold text-[#333333] sm:text-[16px]">
            {t("Performance Indicators")}
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {rows.map((row) => {
            const { Icon, color, bg } = ICONS[row.label] ?? FALLBACK;
            const showSign = row.amount < 0;
            const value = `${showSign ? "-" : ""}${
              row.label === "Total orders"
                ? Math.abs(row.amount).toString()
                : formatEgp(row.amount)
            }`;

            return (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-8 items-center justify-center rounded-[8px]",
                      bg,
                    )}
                  >
                    <Icon size={16} className={color} />
                  </span>
                  <span className="text-[13px] font-medium text-[#28293D]">
                    {t(row.label)}
                  </span>
                </div>
                <span
                  dir="ltr"
                  className={cn(
                    "text-[13px] font-semibold",
                    row.tone === "negative"
                      ? "text-[#C90000]"
                      : row.tone === "positive"
                        ? "text-[#059B5A]"
                        : "text-[#28293D]",
                  )}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicatorsCard;
