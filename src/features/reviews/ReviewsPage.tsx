import { useState, useMemo } from "react";
import { Rating } from "@/shared/components/ui/rating";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import HighestRatedPanel from "./components/HighestRatedPanel";
import RatingDistributionPanel from "./components/RatingDistributionPanel";
import ReviewCard from "./components/ReviewCard";
import {
  INITIAL_REVIEWS,
  RATING_FILTERS,
  CATEGORY_FILTERS,
  RATING_DISTRIBUTION,
  HIGHEST_RATED_CATEGORIES,
} from "./data";
import type { Review, RatingFilter, CategoryFilter } from "./types";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("All Ratings");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("All Categories");

  // ---- Derived ----
  const overallRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reviews.filter((r) => {
      const matchSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);

      const matchRating =
        ratingFilter === "All Ratings" ||
        Math.round(r.rating) === Number(ratingFilter);

      const matchCategory =
        categoryFilter === "All Categories" || r.orderType === categoryFilter;

      return matchSearch && matchRating && matchCategory;
    });
  }, [reviews, search, ratingFilter, categoryFilter]);

  // ---- Handlers ----
  const handleHide = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isHidden: !r.isHidden } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">
              Customer reviews
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Customer feedback on completed orders
            </p>
          </div>

          {/* Overall rating badge */}
          <div className="flex flex-col items-center rounded-[12px] border border-[#E5E5E5] bg-white px-5 py-3 shadow-sm">
            <span className="text-[22px] font-bold text-[#F5A623]">
              {overallRating.toFixed(1)}
            </span>
            <Rating rating={overallRating} size="sm" />
            <span className="mt-0.5 text-[11px] text-[#6B6B6B]">
              {reviews.length} ratings
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder="Search customer..."
            className="flex-1"
          />
          <DropdownSelect
            options={RATING_FILTERS}
            selected={ratingFilter}
            placeholder="All Ratings"
            align="end"
            className="w-[160px] md:w-[160px]"
            onSelect={(v) => setRatingFilter(v as RatingFilter)}
          />
          <DropdownSelect
            options={CATEGORY_FILTERS}
            selected={categoryFilter}
            placeholder="All Categories"
            align="end"
            className="w-[180px] md:w-[180px]"
            onSelect={(v) => setCategoryFilter(v as CategoryFilter)}
          />
        </div>

        {/* Analytics panels */}
        <div className="mb-6 grid grid-cols-2 gap-5">
          <RatingDistributionPanel
            distribution={RATING_DISTRIBUTION}
            totalReviews={reviews.length}
          />
          <HighestRatedPanel categories={HIGHEST_RATED_CATEGORIES} />
        </div>

        {/* Reviews grid */}
        {filteredReviews.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-[16px] border border-[#E5E5E5] bg-white text-[14px] text-[#6B6B6B]">
            No reviews found.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHide={handleHide}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
