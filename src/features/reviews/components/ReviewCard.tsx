import { EyeOff, Trash2 } from "lucide-react";
import { Rating } from "@/shared/components/ui/rating";
import ActionButton from "@/shared/components/ActionButton";

import { cn } from "@/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import type { Review } from "../types";

interface ReviewCardProps {
  review: Review;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
}

const orderTypeBadgeStyle: Record<Review["orderType"], string> = {
  Delivery: "border border-[#93C5FD] bg-[#EFF6FF] text-[#2563EB]",
  "Dine-in": "border border-[#A8DFC4] bg-[#E8F5EE] text-[#1A7A45]",
  Pickup: "border border-[#F5D8A8] bg-[#FFF5DC] text-[#B56C00]",
};

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-[#059B5A]";
  if (rating >= 3) return "text-[#F5A623]";
  return "text-[#C90000]";
};

const borderColor = (rating: number) => {
  if (rating < 2.5) return "border-l-4 border-l-[#C90000]";
  if (rating < 3.5) return "border-l-4 border-l-[#F5A623]";
  return "border-l-4 border-l-[#059B5A]";
};

const ReviewCard = ({ review, onHide, onDelete }: ReviewCardProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-white p-4 shadow-sm",
        borderColor(review.rating)
      )}
    >
      {/* Header — name, rating */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[14px] font-bold text-[#28293D]">
            {review.customerName}
          </p>
          <p className="text-[11px] text-[#6B6B6B]">{review.phone}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <Rating rating={review.rating} size="sm" />
          <span
            className={cn(
              "text-[11px] font-semibold",
              getRatingColor(review.rating)
            )}
          >
            {review.rating.toFixed(1)} / {review.maxRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Order info */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#28293D]">
            {review.orderId}
          </span>
          <span className="text-[#6B6B6B]">·</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              orderTypeBadgeStyle[review.orderType]
            )}
          >
            {review.orderType}
          </span>
        </div>

        {/* Comment */}
        <div className="rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF8] px-3 py-2.5">
          <p className="text-[13px] text-[#28293D]">{review.comment}</p>
        </div>

        {/* Tags */}
        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-[11px] font-medium text-[#6B6B6B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Separator + Footer - Always at the bottom */}
      <div className="mt-auto">
        <Separator className="bg-[#E5E5E5]" />
        <div className="flex items-center justify-between pt-3">
          <span className="text-[11px] text-[#6B6B6B]">{review.date}</span>
          <div className="flex items-center gap-2">
            <ActionButton
              data={{
                icon: <EyeOff size={15} />,
                iconColor: "text-[#6B6B6B] hover:text-[#28293D]",
                onClick: () => onHide(review.id),
              }}
            />
            <ActionButton
              data={{
                icon: <Trash2 size={15} />,
                iconColor: "text-[#C90000] hover:text-[#A00000]",
                onClick: () => onDelete(review.id),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
