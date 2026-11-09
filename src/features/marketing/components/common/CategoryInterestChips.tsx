import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCategories } from "@/features/categories/api/categoriesApi";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface CategoryInterestChipsProps {
  selectedInterests: string[]; // Category ids
  onToggleInterest: (categoryId: string) => void;
  className?: string;
}

export const CategoryInterestChips = ({
  selectedInterests,
  onToggleInterest,
  className,
}: CategoryInterestChipsProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.map((c) => ({ id: c._id, name: c.name }))))
      .catch((err) => console.error("Failed to load categories for interests filter:", err));
  }, []);

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <div>
        <span className="text-[#1A1A1A] text-[14px] font-semibold font-['Montserrat',sans-serif]">
          {t("Interests")}{" "}
        </span>
        <span className="text-[#595959] text-[12px] font-normal font-['Montserrat',sans-serif]">
          {t("(optional) — customers who ordered from these categories or favorited them")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {categories.map((cat) => {
          const isSelected = selectedInterests.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleInterest(cat.id)}
              className={cn(
                "h-9 px-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] inline-flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs active:scale-95",
                isSelected
                  ? "bg-[#F5F0EA] outline-[#8F6900] text-black font-semibold text-xs"
                  : "bg-white outline-[#CACBD4] hover:outline-[#8F6900]/50 text-[#1A1A1A] font-normal text-xs"
              )}
            >
              <span className="font-['Montserrat',sans-serif] whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
