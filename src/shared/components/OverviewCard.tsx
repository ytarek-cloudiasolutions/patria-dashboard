import type { OverviewCardProps } from "../types/overviewCard.types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const OverviewCard = ({ data }: { data: OverviewCardProps }) => {
  return (
    <Card className="h-28.75 rounded-[16px] border border-[#E5E5E5] shadow-sm">
      <CardContent className="flex flex-col">
        <p className="mb-2 font-semibold text-[12px] text-[#28293D]">
          {data.title}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[32px] text-[#28293D]">
            {data.value}
          </p>
          <Badge
            className={`${data.badgeColor} w-11.5 h-11.5 rounded-[11.15px]`}
          >
            <span className={`w-[20.25px] h-[19.5px]${data.iconColor}`}>
              <img src={data.icon} alt={data.icon} />
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
