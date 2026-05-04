import { Star } from "lucide-react";
import type { RatingDistribution } from "../types";

interface RatingDistributionPanelProps {
  distribution: RatingDistribution[];
  totalReviews: number;
}

const RatingDistributionPanel = ({
  distribution,
  totalReviews,
}: RatingDistributionPanelProps) => {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[15px] font-bold text-[#28293D]">
          Distribution of ratings
        </span>
        <Star size={16} className="text-[#6B6B6B]" />
      </div>

      <div className="flex flex-col gap-3">
        {[...distribution].reverse().map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            {/* Star number + icon */}
            <div className="flex w-5 shrink-0 items-center justify-end gap-1">
              <span className="text-[13px] font-semibold text-[#28293D]">
                {star}
              </span>
            </div>
            <Star
              size={14}
              className="shrink-0 fill-[#F5A623] text-[#F5A623]"
            />

            {/* Bar */}
            <div className="flex-1 overflow-hidden rounded-full bg-[#F5F0EA] h-3">
              <div
                className="h-3 rounded-full bg-[#F5A623] transition-all duration-500"
                style={{
                  width: count === 0 ? "0%" : `${(count / maxCount) * 100}%`,
                }}
              />
            </div>

            {/* Count */}
            <span className="w-4 shrink-0 text-right text-[13px] text-[#6B6B6B]">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistributionPanel;
