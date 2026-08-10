import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PosCategory } from "../types";

type CategoryTabsProps = {
  categories: PosCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
};

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80";

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex min-w-[102px] shrink-0 flex-col items-center justify-center gap-2 rounded-[5px] bg-white px-3 py-6 transition-all cursor-pointer",
              isActive
                ? "border-2 border-[#725400]"
                : "border border-[#CACBD4] hover:border-[#725400]/50",
            )}
          >
            <div className="flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5F0EA]">
              <img
                src={category.imageUrl || DEFAULT_CATEGORY_IMAGE}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <span className="text-center text-[14px] font-medium leading-[14.98px] tracking-[0.28px] text-black whitespace-nowrap">
              {t(category.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
