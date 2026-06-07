import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Rating } from "@/shared/components/ui/rating";
import { Separator } from "@/shared/components/ui/separator";
import ActionButton from "@/shared/components/ActionButton";
import { cn } from "@/lib/utils";
import type { Review } from "../types";

interface ReviewCardProps {
  review: Review;
  onToggleVisibility: (review: Review) => void;
  onDelete: (review: Review) => void;
}

const ratingAccent = (rating: number) => {
  if (rating >= 4) return { stripe: "bg-[#059B5A]", text: "text-[#059B5A]" };
  if (rating >= 3) return { stripe: "bg-[#F6B73C]", text: "text-[#F6B73C]" };
  return { stripe: "bg-[#C90000]", text: "text-[#C90000]" };
};

const ReviewCard = ({
  review,
  onToggleVisibility,
  onDelete,
}: ReviewCardProps) => {
  const accent = ratingAccent(review.rating);

  return (
    <Card className="relative h-full overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1", accent.stripe)}
      />

      <CardContent className="flex h-full flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5">
        {/* Customer + rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#28293D]">
              {review.customerName}
            </p>
            <p className="text-[12px] text-[#8B8B8B]">{review.customerCode}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Rating
              rating={review.rating}
              maxRating={review.maxRating}
              size="sm"
              className="**:data-[slot=rating-star-empty]:text-[#FDA900]"
            />
            <span className={cn("text-[11px] font-semibold", accent.text)}>
              {review.rating.toFixed(1)} / {review.maxRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Order id + type */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#28293D]">
            {review.orderId}
          </span>
          <span
            aria-hidden="true"
            className="inline-block size-0.5 rounded-full bg-[#595959]"
          />
          <Badge className="h-5 rounded-full border border-current bg-[#EDF4FB] px-2 text-[10px] font-semibold tracking-wide text-[#004EF9]">
            {review.orderType}
          </Badge>
        </div>

        {/* Comment */}
        <div className="rounded-[10px] bg-white border border-[#E5E5E5] p-3 text-[13px] text-[#000000]">
          "{review.comment}"
        </div>

        {/* Categories */}
        {review.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.categories.map((category) => (
              <Badge
                key={category}
                className="h-9.75 rounded-[4px] border-2 border-[#CACBD4] bg-[#F5F0EA] px-2 py-3.5 text-[11px] font-medium text-[#333333]"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="mt-auto bg-[#CACBD4]" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-[#595959]">
            {review.createdAt}
          </p>
          <div className="flex items-center gap-3">
            <ActionButton
              data={{
                icon: review.isHidden ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                ),
                iconColor: "text-[#000000]",
                ariaLabel: review.isHidden
                  ? `Show review from ${review.customerName}`
                  : `Hide review from ${review.customerName}`,
                onClick: () => onToggleVisibility(review),
              }}
            />
            <ActionButton
              data={{
                icon: <Trash2 size={16} />,
                iconColor: "text-[#C90000]",
                ariaLabel: `Delete review from ${review.customerName}`,
                onClick: () => onDelete(review),
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
