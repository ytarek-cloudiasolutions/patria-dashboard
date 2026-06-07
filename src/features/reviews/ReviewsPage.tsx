import { useMemo, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DeleteDialog from "@/shared/components/DeleteDialog";

import OverallRatingCard from "./components/OverallRatingCard";
import RatingDistributionCard from "./components/RatingDistributionCard";
import HighestRatedCard from "./components/HighestRatedCard";
import ReviewCard from "./components/ReviewCard";
import {
  INITIAL_REVIEWS,
  REVIEW_CATEGORY_FILTERS,
  REVIEW_RATING_FILTERS,
} from "./data";
import type {
  HighestRatedItem,
  RatingDistributionRow,
  Review,
  ReviewCategory,
} from "./types";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState({
    rating: false,
    category: false,
  });

  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const isScrimActive =
    isAnyDropdownOpen.rating || isAnyDropdownOpen.category;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const distribution = useMemo<RatingDistributionRow[]>(() => {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }));
  }, [reviews]);

  const highestRated = useMemo<HighestRatedItem[]>(() => {
    const counts = new Map<ReviewCategory, number>();
    reviews.forEach((review) => {
      review.categories.forEach((category) => {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      });
    });
    const fixedOrder: ReviewCategory[] = [
      "Driver friendliness",
      "Service speed",
      "Value for money",
      "Food quality",
      "Packaging",
    ];
    return fixedOrder
      .filter((label) => (counts.get(label) ?? 0) > 0)
      .slice(0, 3)
      .map((label) => ({ label, count: counts.get(label) ?? 0 }));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reviews.filter((review) => {
      if (
        ratingFilter !== "all" &&
        review.rating !== Number(ratingFilter)
      ) {
        return false;
      }
      if (
        categoryFilter !== "all" &&
        !review.categories.includes(categoryFilter as ReviewCategory)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        review.customerName.toLowerCase().includes(q) ||
        review.customerCode.includes(q) ||
        review.orderId.toLowerCase().includes(q) ||
        review.comment.toLowerCase().includes(q)
      );
    });
  }, [reviews, search, ratingFilter, categoryFilter]);

  const handleToggleVisibility = (review: Review) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, isHidden: !r.isHidden } : r,
      ),
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingReview) return;
    setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
    setDeletingReview(null);
  };

  return (
    <>
      {isScrimActive && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title="Customer reviews"
          description="Customer feedback on completed orders"
        />
        <OverallRatingCard
          averageRating={averageRating}
          totalRatings={reviews.length}
        />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder="Search customer..."
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
          <div className="sm:w-56">
            <DropdownSelect
              options={REVIEW_RATING_FILTERS}
              selected={ratingFilter}
              onSelect={setRatingFilter}
              onOpenChange={(open) =>
                setIsAnyDropdownOpen((prev) => ({ ...prev, rating: open }))
              }
              placeholder="All Ratings"
              align="end"
              className="md:w-full"
              contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
            />
          </div>
          <div className="sm:w-56">
            <DropdownSelect
              options={REVIEW_CATEGORY_FILTERS}
              selected={categoryFilter}
              onSelect={setCategoryFilter}
              onOpenChange={(open) =>
                setIsAnyDropdownOpen((prev) => ({ ...prev, category: open }))
              }
              placeholder="All Categories"
              align="end"
              className="md:w-full"
              contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RatingDistributionCard rows={distribution} />
        <HighestRatedCard items={highestRated} />
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white px-6 py-10 text-center text-[14px] text-[#8B8B8B]">
          No reviews match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggleVisibility={handleToggleVisibility}
              onDelete={setDeletingReview}
            />
          ))}
        </div>
      )}

      <DeleteDialog
        open={!!deletingReview}
        onOpenChange={(open) => !open && setDeletingReview(null)}
        data={{
          item: deletingReview?.customerName ?? "",
          type: "review",
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ReviewsPage;
