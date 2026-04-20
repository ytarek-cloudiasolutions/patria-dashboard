import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import Calendar from "@/assets/icons/calendar.svg";
import Edit from "@/assets/icons/edit.svg";
import Delete from "@/assets/icons/delete.svg";
import { useState } from "react";
import type { Offer } from "../types";
import { Switch } from "@/shared/components/ui/switch";

interface OfferCardProps {
  offer: Offer;
  onStatusChange?: (offerId: number, newStatus: boolean) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: number) => void;
}

const OfferCard = ({
  offer,
  onStatusChange,
  onEdit,
  onDelete,
}: OfferCardProps) => {
  const [isActive, setIsActive] = useState(offer.offerStatus);

  const handleStatusChange = (newStatus: boolean) => {
    setIsActive(newStatus);
    onStatusChange?.(offer.id, newStatus);
  };
  return (
    <Card className="w-88 h-82.5 border border-[#8B8B8B] rounded-[16px]">
      <CardHeader className="space-y-2">
        <Badge
          className={`w-17 h-6 rounded-[30px] font-semibold text-[13px] ${
            isActive
              ? "bg-[#EDF8F0] text-[#059B5A]"
              : "bg-[#DCDCDC] text-[#23252A]"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-bold text-[20px]">
              {offer.offerTitle}
            </CardTitle>
            <CardDescription className="font-normal text-[13px]">
              {offer.offerDescription}
            </CardDescription>
          </div>
          <Badge className="w-18.25 h-7.75 rounded-[5px] bg-[#F5F0EA] font-bold text-[12px] text-[#333333]">
            {offer.discountType === "percentage"
              ? `${offer.offerPercentage}% OFF`
              : `${offer.offerPercentage} EGP`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Card className="w-78 px-2 py-2 bg-[#FAFAF7] border border-[#E5E5E5] rounded-[10px]">
          <div className="flex items-center gap-2">
            <div>
              <img src={Calendar} className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-normal text-[13px] text-[#333333]">
                Valid Period
              </span>
              <span className="font-semibold text-[16px] text-[#28293D]">
                {offer.offerValidPeriod}
              </span>
            </div>
          </div>
        </Card>
        <Card className="w-78 px-2 py-2 bg-[#FAFAF7] border border-[#E5E5E5] rounded-[10px]">
          <span className="font-normal text-[12px]">
            Applies to {offer.numberOfProducts} product(s)
          </span>
        </Card>
        <Separator className="bg-[#CACBD4]" />
        <div className="flex justify-between">
          <div className="flex gap-3">
            <span className="font-medium text-[13px]">Active</span>
            <Switch checked={isActive} onCheckedChange={handleStatusChange} />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onEdit?.(offer)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <img src={Edit} alt="Edit" className="w-3.75 h-3.75" />
            </button>
            <button
              onClick={() => onDelete?.(offer.id)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <img src={Delete} alt="Delete" className="w-3.75 h-3.75" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
