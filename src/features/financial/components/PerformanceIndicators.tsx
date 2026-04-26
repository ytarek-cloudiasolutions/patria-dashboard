import { ShoppingCart, TrendingUp, Users, DollarSign, Tag } from "lucide-react";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  totalOrders?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  orders: <ShoppingCart className="size-4 text-[#8B8B8B]" />,
  profit: <TrendingUp className="size-4 text-[#8B8B8B]" />,
  salaries: <Users className="size-4 text-[#8B8B8B]" />,
  operating: <DollarSign className="size-4 text-[#8B8B8B]" />,
  avg: <Tag className="size-4 text-[#8B8B8B]" />,
};

const PerformanceIndicators = ({ transactions, totalOrders = 20 }: Props) => {
  const revenue = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netProfit = revenue - expenses;

  const salaries = transactions
    .filter((t) => t.isSalary)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const operatingExpenses = transactions
    .filter((t) => t.type === "expense" && !t.isSalary)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const avgOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

  const indicators = [
    {
      key: "orders",
      label: "Total orders",
      value: totalOrders,
      prefix: "",
      isNegative: false,
    },
    {
      key: "profit",
      label: "Net Profit",
      value: netProfit,
      prefix: "EGP ",
      isNegative: netProfit < 0,
    },
    {
      key: "salaries",
      label: "Salaries",
      value: salaries,
      prefix: "EGP ",
      isNegative: false,
    },
    {
      key: "operating",
      label: "Operating Expenses",
      value: operatingExpenses,
      prefix: "EGP ",
      isNegative: false,
    },
    {
      key: "avg",
      label: "Avg. Order Value",
      value: avgOrderValue,
      prefix: "EGP ",
      isNegative: false,
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="size-4 text-[#28293D]" />
        <h3 className="text-[14px] font-semibold text-[#28293D]">
          Performance Indicators
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-[#F5F5F5]">
        {indicators.map((ind) => (
          <div key={ind.key} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              {iconMap[ind.key]}
              <span className="text-[13px] text-[#28293D]">{ind.label}</span>
            </div>
            <span
              className={`text-[13px] font-semibold ${
                ind.isNegative ? "text-[#C90000]" : "text-[#28293D]"
              }`}
            >
              {ind.prefix}
              {ind.isNegative ? "-" : ""}
              {Math.abs(ind.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceIndicators;
