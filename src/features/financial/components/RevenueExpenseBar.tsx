import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

interface RevenueExpenseBarProps {
  revenue: number;
  expenses: number;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const RevenueExpenseBar = ({ revenue, expenses }: RevenueExpenseBarProps) => {
  const total = revenue + expenses;
  const revenuePct = total === 0 ? 50 : (revenue / total) * 100;
  const expensePct = total === 0 ? 50 : (expenses / total) * 100;
  const balancePct =
    revenue === 0 ? 0 : ((revenue - expenses) / Math.max(revenue, 1)) * 100;
  const isNegative = balancePct < 0;

  return (
    <Card className="mb-6 gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-bold text-[#28293D] sm:text-[16px]">
          Revenues versus expenses
        </h3>
        <Badge
          className={`h-6 gap-1 rounded-full border px-3 py-0 text-[12px] font-semibold ${
            isNegative
              ? "border-current bg-[#FFF0F0] text-[#C90000]"
              : "border-current bg-[#E2F4ED] text-[#059B5A]"
          }`}
        >
          {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          Balance = {balancePct.toFixed(1)}%
        </Badge>
      </div>
      <CardContent className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex h-12 w-full overflow-hidden rounded-[16px]">
          <div
            className="flex items-center justify-center bg-[#06C270] text-center text-white"
            style={{ width: `${revenuePct}%` }}
          >
            <div className="px-2">
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
                Revenue
              </p>
              <p className="text-[13px] font-bold leading-tight">
                {formatEgp(revenue)}
              </p>
            </div>
          </div>
          <div
            className="flex items-center justify-center bg-[#C90000] text-center text-white"
            style={{ width: `${expensePct}%` }}
          >
            <div className="px-2">
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
                Revenue
              </p>
              <p className="text-[13px] font-bold leading-tight">
                {formatEgp(expenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center px-3 gap-8 text-[12px] font-medium">
          <span className="inline-flex items-center gap-2 text-[#059B5A]">
            <span className="size-1 rounded-full bg-[#059B5A]" />
            Revenue ({revenuePct.toFixed(1)}%)
          </span>
          <span className="inline-flex items-center gap-2 text-[#C90000]">
            <span className="size-1 rounded-full bg-[#C90000]" />
            Expenses ({expensePct.toFixed(1)}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueExpenseBar;
