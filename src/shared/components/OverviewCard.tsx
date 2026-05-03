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
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] ring-0 shadow">
      <CardContent className="flex flex-1 justify-between items-center px-6 py-6">
        <div>
          {data.trend && (
            <span
              className={`${trendClassName} mb-[6.5px] inline-flex h-4 min-w-12 items-center justify-center rounded-[30px] border px-2 text-[10px] font-semibold leading-none`}
            >
              {data.trend.value}
            </span>
          )}
          <p className="mb-2 text-[#28293D] text-[10px] font-semibold ">
            {data.title}
          </p>
          <p className="text-[#28293D] text-[20px] font-semibold">
            {data.value}
          </p>
        </div>
        <Badge className={`${data.badgeColor} w-11.5 h-11.5 rounded-[11.15px]`}>
          <span className={`${data.iconColor}`}>{data.icon}</span>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
