import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DeleteDialog from "@/shared/components/DeleteDialog";

import OverallRatingCard from "./components/OverallRatingCard";
import RatingDistributionCard from "./components/RatingDistributionCard";
import HighestRatedCard from "./components/HighestRatedCard";
import ReviewCard from "./components/ReviewCard";
import { REVIEW_CATEGORY_FILTERS, REVIEW_RATING_FILTERS } from "./data";
import { useReviews } from "./hooks/useReviews";
import type { Review as BackendReview } from "./store/reviewsTypes";
import type {
  HighestRatedItem,
  RatingDistributionRow,
  Review,
  ReviewCategory,
} from "./types";

// ---------------------------------------------------------------------------
// Mapper: backend Review → local UI Review
// ---------------------------------------------------------------------------

const toLocalReview = (r: BackendReview, idx: number): Review => ({
  id: idx + 1,
  customerName: r.customerName,
  customerCode: r.customerPhone ?? "",
  orderId: r.orderId ?? "",
  orderType: (r.orderType as Review["orderType"]) ?? "Delivery",
  rating: r.rating,
  maxRating: 5,
  comment: r.comment ?? "",
  categories: r.categories as ReviewCategory[],
  createdAt: r.createdAt
    ? new Date(r.createdAt).toLocaleString()
    : "",
  isHidden: !r.isVisible,
});

const ReviewsPage = () => {
  const { t } = useTranslation();

  const {
    reviews: hookReviews,
    reviewStats,
    getReviews,
    deleteReview,
    toggleVisibility,
  } = useReviews();

  // Local UI state — seeded from the store
  const [reviews, setReviews] = useState<Review[]>([]);

  // Map local numeric id → backend _id string (for mutations)
  const idMap = useRef<Map<number, string>>(new Map());

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState({
    rating: false,
    category: false,
  });
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  // Fetch on mount
  useEffect(() => {
    getReviews();
  }, [getReviews]);

  // Sync local state whenever store updates
  useEffect(() => {
    if (hookReviews && hookReviews.length > 0) {
      idMap.current.clear();
      const mapped: Review[] = hookReviews.map((r: BackendReview, idx: number) => {
        const localId = idx + 1;
        idMap.current.set(localId, r._id);
        return toLocalReview(r, idx);
      });
      setReviews(mapped);
    }
  }, [hookReviews]);

  const isScrimActive = isAnyDropdownOpen.rating || isAnyDropdownOpen.category;

  // -------------------------------------------------------------------------
  // Stats derived from hook (with local fallbacks)
  // -------------------------------------------------------------------------
  const averageRating = useMemo(() => {
    if (reviewStats?.avgRating != null) return reviewStats.avgRating;
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviewStats, reviews]);

  const totalRatings = useMemo(() => {
    return reviewStats?.totalReviews ?? reviews.length;
  }, [reviewStats, reviews]);

  const distribution = useMemo<RatingDistributionRow[]>(() => {
    if (reviewStats?.distribution) {
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: reviewStats.distribution[stars as 1 | 2 | 3 | 4 | 5] ?? 0,
      }));
    }
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }));
  }, [reviewStats, reviews]);

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
      if (ratingFilter !== "all" && review.rating !== Number(ratingFilter)) {
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

  // -------------------------------------------------------------------------
  // Actions — delegate mutations to the hook
  // -------------------------------------------------------------------------
  const handleToggleVisibility = (review: Review) => {
    const backendId = idMap.current.get(review.id);
    if (backendId) {
      toggleVisibility(backendId, { isVisible: !!review.isHidden });
    }
    // Optimistic local update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, isHidden: !r.isHidden } : r,
      ),
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingReview) return;
    const backendId = idMap.current.get(deletingReview.id);
    if (backendId) {
      deleteReview(backendId);
    }
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
          title={t("Customer reviews")}
          description={t("Customer feedback on completed orders")}
        />
        <OverallRatingCard
          averageRating={averageRating}
          totalRatings={totalRatings}
        />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search customer...")}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
          <div className="sm:w-56">
            <DropdownSelect
              options={REVIEW_RATING_FILTERS.map((o) => ({ ...o, label: t(o.label) }))}
              selected={ratingFilter}
              onSelect={setRatingFilter}
              onOpenChange={(open) =>
                setIsAnyDropdownOpen((prev) => ({ ...prev, rating: open }))
              }
              placeholder={t("All Ratings")}
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
              placeholder={t("All Categories")}
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
          {t("No reviews match your filters.")}
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
