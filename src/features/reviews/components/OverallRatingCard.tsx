import { Card, CardContent } from "@/shared/components/ui/card";
import { Rating } from "@/shared/components/ui/rating";

interface OverallRatingCardProps {
  averageRating: number;
  totalRatings: number;
}

const OverallRatingCard = ({
  averageRating,
  totalRatings,
}: OverallRatingCardProps) => (
  <Card className="w-full rounded-[16px] bg-[#F5F0EA] py-0 ring-0 sm:w-auto">
    <CardContent className="flex flex-col items-center justify-center gap-1 px-5 py-3 sm:px-6 sm:py-4">
      <p className="text-[22px] font-semibold leading-none text-[#8F6900] sm:text-[24px]">
        {averageRating.toFixed(1)}
      </p>
      <Rating
        rating={averageRating}
        maxRating={5}
        size="sm"
        className="**:data-[slot=rating-star-empty]:text-[#FDA900]"
      />
      <p className="text-[11px] font-medium text-[#000000]">
        {totalRatings} ratings
      </p>
    </CardContent>
  </Card>
);

export default OverallRatingCard;
