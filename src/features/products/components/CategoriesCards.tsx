import { Box, Loader2, SquarePen, Trash2 } from "lucide-react";
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
  onEdit?: (category: Category) => void;
  onCardClick?: (category: Category) => void;
}

const CategoriesCards = ({
  categories,
  togglingCategoryId,
  isLoading = false,
  isMutating = false,
  onToggleActive,
  onDelete,
  onEdit,
  onCardClick,
}: CategoriesCardsProps) => {
  const { t, language } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[104px] animate-pulse rounded-xl border-2 border-[#E5E5E5] bg-[#FAFAF7]"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#CACBD4] bg-[#FAFAF7] p-8 text-center">
        <p className="text-[15px] font-semibold text-[#8B8B8B]">
          {t("No categories found.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const isToggling = togglingCategoryId === category.id;
        const displayName =
          language === "ar" && category.nameAr ? category.nameAr : category.name;

        return (
          <div
            key={category.id}
            onClick={() => onCardClick?.(category)}
            className="group relative flex items-center justify-between rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-6 sm:px-4 gap-4 transition-all duration-200 hover:shadow-md cursor-pointer min-w-0"
          >
            {/* Left Content (Image + Name & Count) */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Category Image */}
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border-[0.47px] border-[#E5E5E5] bg-[#FAFAF7]">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={displayName}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Box className="size-6 text-[#A1A1AA]" />
                  </div>
                )}
              </div>

              {/* Name & Count */}
              <div className="flex flex-col justify-center items-start gap-2 min-w-0">
                <h4 className="text-[13px] font-semibold text-black tracking-tight truncate max-w-full" style={{ fontWeight: 600 }}>
                  {displayName}
                </h4>
                <div className="inline-flex items-center gap-1 rounded-[30px] border border-[#8F6900] bg-[#F5F0EA] px-2 py-0.5 overflow-hidden">
                  <span className="text-[12px] font-semibold text-[#8F6900] tracking-tight whitespace-nowrap" style={{ fontWeight: 600 }}>
                    {category.itemCount ?? 0} {language === "ar" ? "منتج" : "Products"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content (Actions) */}
            <div
              className="flex items-center justify-end gap-3 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Active Toggle Switch */}
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
                  className="cursor-pointer text-[#C90000] disabled:opacity-50 hover:opacity-80 transition-opacity p-0.5"
                >
                  <Trash2 className="size-4 text-[#C90000]" />
                </button>
              )}

              {/* Edit Button */}
              {onEdit && (
                <button
                  type="button"
                  disabled={isMutating || togglingCategoryId !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                  }}
                  aria-label={`Edit ${category.name}`}
                  className="cursor-pointer text-[#28293D] hover:text-[#8F6900] disabled:opacity-50 transition-colors p-0.5"
                >
                  <SquarePen className="size-4 text-black" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoriesCards;
