import { Card, CardContent } from "@/shared/components/ui/card";
import type { CouponCardProps } from "../types";
import { Badge } from "@/shared/components/ui/badge";

const CouponCard = ({ coupon }: { coupon: CouponCardProps }) => {
  return (
    <Card className="w-61.25 h-28.75 rounded-[16px] border border-[#E5E5E5] shadow-sm">
      <CardContent className="flex flex-col">
        <span className="mb-2">{coupon.title}</span>
        <div className="flex justify-between">
          <span className="font-semibold text-[32px]">{coupon.value}</span>
          <Badge
            className={`${coupon.badgeColor} w-11.5 h-11.5 rounded-[11.15px]`}
          >
            <span
              className={`flex items-center w-[20.25px] h-[19.5px] ${coupon.iconColor}`}
            >
              {coupon.icon}
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponCard;
