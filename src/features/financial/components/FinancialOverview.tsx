import { Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface FinancialOverviewProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: string;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const FinancialOverview = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
}: FinancialOverviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
      {/* Card 1: Total Revenue */}
      <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
            {t("Total Revenue")}
          </span>
          <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
            {formatEgp(totalRevenue)}
          </span>
        </div>
        <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
          <TrendingUp size={24} className="text-[#8F6900]" />
        </div>
      </div>

      {/* Card 2: Total Expenses */}
      <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
            {t("Total Expenses")}
          </span>
          <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
            {formatEgp(totalExpenses)}
          </span>
        </div>
        <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
          <TrendingDown size={24} className="text-white" />
        </div>
      </div>

      {/* Card 3: Net Profit */}
      <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
            {t("Net Profit")}
          </span>
          <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
            {formatEgp(netProfit)}
          </span>
        </div>
        <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
          <Zap size={24} className="text-[#059B5A]" />
        </div>
      </div>

      {/* Card 4: Profit Margin */}
      <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
            {t("Profit Margin")}
          </span>
          <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
            {profitMargin}
          </span>
        </div>
        <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[rgba(254,154,0,0.10)]">
          <Target size={24} className="text-[#C7861E]" />
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
