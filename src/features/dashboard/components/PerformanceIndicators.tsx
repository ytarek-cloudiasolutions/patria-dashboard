import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { PerformanceIndicator } from "../types";

interface PerformanceIndicatorsProps {
  indicators: PerformanceIndicator[];
}

const toneStyles: Record<PerformanceIndicator["tone"], { bg: string; text: string }> = {
  gold: { bg: "bg-[#F5F0EA]", text: "text-primary" },
  red: { bg: "bg-[#FFF0F0]", text: "text-[#C90000]" },
  blue: { bg: "bg-[#DBEAFE]", text: "text-[#155DFC]" },
  amber: { bg: "bg-[#FFF4DA]", text: "text-[#C7861E]" },
};

const PerformanceIndicators = ({ indicators }: PerformanceIndicatorsProps) => {
  return (
    <Card className="gap-0 rounded-[16px] border-[#E5E5E5] bg-white py-0 shadow-none">
      <CardHeader className="min-h-14 grid-cols-[1fr_auto] items-center rounded-t-[16px] bg-[#F5F0EA] px-4 py-3">
        <CardTitle className="text-[18px] font-bold text-[#333333]">
          Performance Indicators
        </CardTitle>
        <TrendingUp className="size-5 text-[#000000]" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 py-6 sm:gap-4 sm:py-8">
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
                <span className="truncate text-[13px] font-medium">
                  {indicator.label}
                </span>
              </div>
              <span
                className={`ml-3 shrink-0 text-[13px] font-medium ${
                  indicator.tone === "red" ? "text-[#C90000]" : "text-[#28293D]"
                }`}
              >
                {indicator.value}
              </span>
            </div>
          );
        })}

        <div className="mt-1 flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-[16px] bg-primary px-5 py-4 text-white ring-2 ring-[#E5E5E5] sm:min-h-17 sm:px-7.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide">
              POS vs Mobile
            </p>
            <p className="mt-1 text-[13px] sm:text-[14px]">Revenue Mix</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold sm:text-[14px]">63% POS</p>
            <p className="text-[10px]">Physical Stores</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicators;