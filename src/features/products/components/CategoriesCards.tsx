import { Box, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { Switch } from "@/shared/components/ui/switch";

interface CategoriesCardsProps {
  categories: Category[];
  togglingCategoryId?: string | null;
  isLoading?: boolean;
  isMutating?: boolean;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete?: (category: Category) => void;
  onCardClick?: (category: Category) => void;
}

const CategoriesCards = ({
  categories,
  togglingCategoryId,
  isLoading = false,
  isMutating = false,
  onToggleActive,
  onDelete,
  onCardClick,
}: CategoriesCardsProps) => {
  const { t, language } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[260px] animate-pulse rounded-[16px] border-2 border-[#E5E5E5] bg-[#FAFAF7]"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#CACBD4] bg-[#FAFAF7] p-8 text-center">
        <p className="text-[15px] font-semibold text-[#8B8B8B]">
          {t("No categories found")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const isToggling = togglingCategoryId === category.id;

        return (
          <div
            key={category.id}
            onClick={() => onCardClick?.(category)}
            className="group relative flex flex-col justify-between rounded-[16px] border-2 border-[#E5E5E5] bg-white overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            {/* Top Image Container */}
            <div className="relative h-[160px] w-full bg-[#FAFAF7] overflow-hidden flex items-center justify-center border-b border-[#E5E5E5]/50">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover rounded-t-[5px] transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Box className="size-12 text-[#A1A1AA]" />
              )}

              {/* Category Badge (Top-Left) */}
              <div className="absolute top-3.5 start-2.5 z-10">
                <span className="inline-flex items-center rounded-full border border-[#725400] bg-[#8F6900] px-2 py-0.5 text-[10px] font-semibold text-white tracking-[0.20px]">
                  {language === "ar" ? "قسم" : "Category"}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="flex flex-1 flex-col justify-between p-3 gap-3 bg-white">
              <div className="flex flex-col gap-1">
                {/* Category Name */}
                <h4 className="text-[14px] font-semibold text-black tracking-[0.28px] line-clamp-1">
                  {category.name}
                </h4>

                {/* Item Count Subtitle */}
                <p className="text-[13px] font-semibold text-[#595959] tracking-[0.26px]">
                  {category.itemCount ?? 0} {t("items")}
                </p>
              </div>

              {/* Footer Row (Action Controls) */}
              <div
                className="flex items-center justify-end w-full pt-1 gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Active Switch */}
                {isToggling ? (
                  <div className="flex size-9 items-center justify-center">
                    <Loader2 className="size-4.5 animate-spin text-[#059B5A]" />
                  </div>
                ) : (
                  <Switch
                    checked={category.active}
                    disabled={isMutating || togglingCategoryId !== null}
                    onCheckedChange={(val) => onToggleActive(category.id, val)}
                    className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33]"
                  />
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    type="button"
                    disabled={isMutating || togglingCategoryId !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category);
                    }}
                    aria-label={`Delete ${category.name}`}
                    className="flex size-5 items-center justify-center text-[#C90000] transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="size-4.5 text-[#C90000]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoriesCards;
