import type { OverviewCardProps } from "../types/overviewCard.types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const OverviewCard = ({ data }: { data: OverviewCardProps }) => {
  const isPositive = data.trend?.tone === "positive";
  const isNegative = data.trend?.tone === "negative";

  const trendClassName = isPositive
    ? "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]"
    : isNegative
      ? "border-[#C90000] bg-[#C90000] text-white"
      : "border-[#D4D4D4] bg-[#F5F5F5] text-[#595959]";

  const renderTrendContent = () => {
    if (!data.trend) return null;
    if (React.isValidElement(data.trend.value)) {
      return (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          {data.trend.value}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap">
        {isPositive && <TrendingUp className="size-3 shrink-0 text-[#059B5A]" />}
        {isNegative && <TrendingDown className="size-3 shrink-0 text-white" />}
        <span>{data.trend.value}</span>
      </span>
    );
  };

  return (
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] ring-0 shadow-sm w-full">
      <CardContent className="flex flex-1 justify-between items-center px-5 py-5 sm:px-6 sm:py-6">
        <div className="min-w-0 flex-1 pr-3">
          {data.trend && (
            <span
              className={cn(
                "mb-[6.5px] inline-flex items-center justify-center gap-1 rounded-[30px] border px-2 py-[2px] text-[10px] font-semibold tracking-[0.20px] leading-none whitespace-nowrap shrink-0 max-w-fit",
                trendClassName
              )}
            >
              {renderTrendContent()}
            </span>
          )}
          <p className="mb-2 truncate text-[#28293D] text-[10px] font-semibold">
            {data.title}
          </p>
          <p className="truncate text-[#28293D] text-[18px] font-semibold sm:text-[20px]">
            {data.value}
          </p>
        </div>
        <Badge
          className={`${data.badgeColor} shrink-0 w-11.5 h-11.5 rounded-[11.15px]`}
        >
          <span className={`${data.iconColor}`}>{data.icon}</span>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
