import type { OverviewCardProps } from "../types/overviewCard.types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const OverviewCard = ({ data }: { data: OverviewCardProps }) => {
  const trendClassName =
    data.trend?.tone === "positive"
      ? "border-current bg-[#E2F4ED] text-[#059B5A]"
      : data.trend?.tone === "negative"
      ? "border-current bg-[#FFF0F0] text-[#C90000]"
      : "border-[#D4D4D4] bg-[#F5F5F5] text-[#595959]";

  return (
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] ring-0 shadow-sm w-full">
      <CardContent className="flex flex-1 justify-between items-center px-5 py-5 sm:px-6 sm:py-6">
        <div className="min-w-0 flex-1 pr-3">
          {data.trend && (
            <span
              className={`${trendClassName} mb-[6.5px] inline-flex h-4 min-w-12 items-center justify-center rounded-[30px] border px-2 text-[10px] font-semibold leading-none`}
            >
              {data.trend.value}
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
