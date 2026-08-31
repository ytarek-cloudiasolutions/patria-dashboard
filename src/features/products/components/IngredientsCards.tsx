import { Box, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ingredient } from "../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { formatEgp, formatUnit } from "../utils";

interface IngredientsCardsProps {
  ingredients: Ingredient[];
  isLoading?: boolean;
  onEdit: (ingredient: Ingredient) => void;
  onDelete?: (ingredient: Ingredient) => void;
}

const IngredientsCards = ({
  ingredients,
  isLoading = false,
  onEdit,
  onDelete,
}: IngredientsCardsProps) => {
  const { t, language } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-[16px] border-2 border-[#E5E5E5] bg-[#FAFAF7]"
          />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#CACBD4] bg-[#FAFAF7] p-8 text-center">
        <p className="text-[15px] font-semibold text-[#8B8B8B]">
          {t("No recipes found")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {ingredients.map((ingredient) => {
        const displayUnit = ingredient.unit
          ? formatUnit(ingredient.unit)
          : "Piece(s)";

        return (
          <div
            key={ingredient.id}
            className="group relative flex flex-col justify-between rounded-[16px] border-2 border-[#E5E5E5] bg-white overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Top Image Container */}
            <div className="relative h-[160px] w-full bg-[#FAFAF7] overflow-hidden flex items-center justify-center border-b border-[#E5E5E5]/50">
              {ingredient.imageUrl ? (
                <img
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  className="h-full w-full object-cover rounded-t-[5px] transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Box className="size-12 text-[#A1A1AA]" />
              )}

              {/* Raw Ingredient Badge (Top-Left) */}
              <div className="absolute top-3.5 start-2.5 z-10">
                <span className="inline-flex items-center rounded-full border border-[#725400] bg-[#8F6900] px-2 py-0.5 text-[10px] font-semibold text-white tracking-[0.20px]">
                  {language === "ar" ? "مكون خام" : "Raw Ingredient"}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="flex flex-1 flex-col justify-between p-3 gap-3 bg-white">
              <div className="flex flex-col gap-1">
                {/* Ingredient Title */}
                <h4 className="text-[14px] font-semibold text-black tracking-[0.28px] line-clamp-1">
                  {ingredient.name}
                </h4>

                {/* Stock Quantity Subtitle */}
                <p className="text-[13px] font-semibold text-[#595959] tracking-[0.26px]">
                  {ingredient.quantity ?? 0} {displayUnit}
                </p>
              </div>

              {/* Footer Row (Price & Action Icons) */}
              <div className="flex items-center justify-between w-full pt-1">
                <span className="text-[16px] text-black tracking-[0.32px]">
                  <span className="font-normal">EGP</span>
                  <span className="font-bold">
                    {" "}
                    {formatEgp(ingredient.price).replace(/^EGP\s*/i, "")}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => onEdit(ingredient)}
                    aria-label={t("Edit ingredient")}
                    className="flex size-5 items-center justify-center text-black transition-opacity hover:opacity-80 cursor-pointer"
                  >
                    <SquarePen className="size-4.5 text-black" />
                  </button>

                  {/* Delete Button */}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(ingredient)}
                      aria-label={t("Delete ingredient")}
                      className="flex size-5 items-center justify-center text-[#C90000] transition-opacity hover:opacity-80 cursor-pointer"
                    >
                      <Trash2 className="size-4.5 text-[#C90000]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IngredientsCards;
