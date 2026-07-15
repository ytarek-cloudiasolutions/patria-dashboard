import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { api } from "@/config/api";
import { showSuccessToast } from "@/shared/utils/toast";

import OverallRatingCard from "./components/OverallRatingCard";
import RatingDistributionCard from "./components/RatingDistributionCard";
import HighestRatedCard from "./components/HighestRatedCard";
import ReviewCard from "./components/ReviewCard";
import {
  REVIEW_CATEGORY_FILTERS,
  REVIEW_RATING_FILTERS,
} from "./data";
import type {
  HighestRatedItem,
  RatingDistributionRow,
  Review,
  ReviewCategory,
} from "./types";

const VALID_CATEGORIES: ReviewCategory[] = [
  "Service speed",
  "Driver friendliness",
  "Value for money",
  "Food quality",
  "Packaging",
  "Cleanliness",
];

const mapReview = (r: any, idx: number): Review => ({
  id: r._id ?? idx,
  customerName: r.customerId?.name ?? r.customerName ?? "Anonymous",
  customerCode: r.customerId?.phone ?? r.customerPhone ?? "—",
  orderId: r.orderId?._id ?? r.orderId ?? "—",
  orderType: r.orderType === "dine_in" ? "Dine-in" : r.orderType === "takeaway" ? "Pickup" : "Delivery",
  rating: r.rating ?? 0,
  maxRating: 5,
  comment: r.comment ?? "",
  categories: (r.categories ?? []).filter((c: string) =>
    VALID_CATEGORIES.includes(c as ReviewCategory),
  ) as ReviewCategory[],
  createdAt: r.createdAt
    ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—",
  isHidden: r.isVisible === false,
});

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState({
    rating: false,
    category: false,
  });

  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  useEffect(() => {
    const delayDebounceId = setTimeout(() => {
      const params: any = { limit: 100 };
      if (ratingFilter !== "all") {
        params.rating = Number(ratingFilter);
      }
      if (categoryFilter !== "all") {
        params.category = categoryFilter;
      }
      if (search.trim()) {
        params.search = search.trim();
      }
      api
        .get("/reviews", { params })
        .then((res) => {
          const raw: any[] = res.data?.data ?? res.data?.reviews ?? [];
          const mapped = raw.map(mapReview);
          setReviews(mapped);
          if (res.data?.stats) {
            setStats(res.data.stats);
          }
          if (ratingFilter === "all" && categoryFilter === "all" && !search.trim()) {
            setAllReviews(mapped);
          }
        })
        .catch(() => {});
    }, 300);

    return () => clearTimeout(delayDebounceId);
  }, [ratingFilter, categoryFilter, search]);

  const isScrimActive =
    isAnyDropdownOpen.rating || isAnyDropdownOpen.category;

  const averageRating = useMemo(() => {
    if (stats?.avgRating !== undefined) return stats.avgRating;
    if (allReviews.length === 0) return 0;
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    return total / allReviews.length;
  }, [allReviews, stats]);

  const distribution = useMemo<RatingDistributionRow[]>(() => {
    if (stats?.distribution) {
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: stats.distribution[stars] ?? 0,
      }));
    }
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: allReviews.filter((r) => r.rating === stars).length,
    }));
  }, [allReviews, stats]);

  const highestRated = useMemo<HighestRatedItem[]>(() => {
    if (stats?.highestRated) {
      return (stats.highestRated as any[]).map((item) => ({
        label: item.name as ReviewCategory,
        count: item.count,
      }));
    }
    const counts = new Map<ReviewCategory, number>();
    allReviews.forEach((review) => {
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
      "Cleanliness",
    ];
    return fixedOrder
      .filter((label) => (counts.get(label) ?? 0) > 0)
      .slice(0, 3)
      .map((label) => ({ label, count: counts.get(label) ?? 0 }));
  }, [allReviews, stats]);

  const filteredReviews = useMemo(() => {
    return reviews;
  }, [reviews]);

  const handleToggleVisibility = async (review: Review) => {
    try {
      await api.patch(`/reviews/${review.id}/visibility`, {
        isVisible: review.isHidden,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, isHidden: !r.isHidden } : r,
        ),
      );
      setAllReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, isHidden: !r.isHidden } : r,
        ),
      );
    } catch {
      // silently ignore
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    try {
      await api.delete(`/reviews/${deletingReview.id}`);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setAllReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      showSuccessToast(t("Review deleted"));
    } catch {
      // silently ignore
    }
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
          totalRatings={stats?.totalReviews ?? allReviews.length}
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
