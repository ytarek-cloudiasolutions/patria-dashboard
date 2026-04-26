import type { OverviewCardProps } from "../types/overviewCard.types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const OverviewCard = ({ data }: { data: OverviewCardProps }) => {
  return (
    <Card className="py-6 rounded-[16px] border border-[#E5E5E5] ring-0 shadow">
      <CardContent className="flex justify-between items-center px-6">
        <div>
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
