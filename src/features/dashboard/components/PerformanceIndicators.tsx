import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PerformanceIndicator } from "../types";

interface PerformanceIndicatorsProps {
  indicators: PerformanceIndicator[];
  posRevenuePercent?: number;
}

const toneStyles: Record<PerformanceIndicator["tone"], { bg: string; text: string }> = {
  gold: { bg: "bg-[#F5F0EA]", text: "text-[#8F6900]" },
  red: { bg: "bg-[#C90000]", text: "text-white" },
  blue: { bg: "bg-[#DBEAFE]", text: "text-[#155DFC]" },
  amber: { bg: "bg-[rgba(254,154,0,0.10)]", text: "text-[#C7861E]" },
};

const PerformanceIndicators = ({
  indicators,
  posRevenuePercent = 0,
}: PerformanceIndicatorsProps) => {
  const { t } = useTranslation();

  return (
    <Card className="gap-0 rounded-[16px] border-[#E5E5E5] bg-white py-0 shadow-none">
      <CardHeader className="min-h-14 grid-cols-[1fr_auto] items-center rounded-t-[16px] bg-[#F5F0EA] px-4 py-3">
        <CardTitle className="text-[18px] font-semibold text-[#333333]">
          {t("Performance Indicators")}
        </CardTitle>
        <TrendingUp className="size-5 text-black" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 py-6 sm:gap-4 sm:py-6">
        {indicators.map((indicator) => {
          const Icon = indicator.icon;
          const style = toneStyles[indicator.tone];

          return (
            <div
              key={indicator.id}
              className="flex items-center justify-between rounded-[8px] border border-[#CACBD4] bg-[#FAFAF7] p-3 text-[#28293D]"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={`${style.bg} ${style.text} flex shrink-0 items-center justify-center rounded-[5px] p-1`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="truncate text-[13px] font-medium tracking-[0.26px] text-black">
                  {t(indicator.label)}
                </span>
              </div>
              <span className="ml-3 shrink-0 text-[13px] font-medium tracking-[0.26px] text-black">
                {indicator.value}
              </span>
            </div>
          );
        })}

        <div className="mt-1 flex min-h-16 items-center justify-between gap-3 rounded-[16px] bg-[#8F6900] px-6 py-4 text-white ring-2 ring-[#E5E5E5]">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.20px] leading-[10.70px] text-white">
              {t("POS vs Mobile")}
            </p>
            <p className="text-[14px] font-semibold tracking-[0.28px] leading-[19.60px] text-white">
              {t("Revenue Mix")}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-[14px] font-bold tracking-[0.28px] leading-[14.98px] text-white">
              {posRevenuePercent}% POS
            </p>
            <p className="text-[10px] font-medium tracking-[0.20px] leading-[14px] text-white">
              {t("Physical Stores")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicators;