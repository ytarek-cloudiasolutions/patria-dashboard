import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PosCategory } from "../types";

type CategoryTabsProps = {
  categories: PosCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
};

import patriaLogo from "@/assets/images/svgs/patria-logo.svg";

export const DEFAULT_CATEGORY_IMAGE = patriaLogo;

const KNOWN_CATEGORY_FALLBACKS: Record<string, string> = {
  all: patriaLogo,
  coffee: "https://api.patriacoffeebeans.com/api/uploads/1788859131178-224063310.jpg",
  pizzas: "https://api.patriacoffeebeans.com/api/uploads/1792483762044-367120846.jpeg",
  pizza: "https://api.patriacoffeebeans.com/api/uploads/1792483762044-367120846.jpeg",
  البيتزا: "https://api.patriacoffeebeans.com/api/uploads/1792483762044-367120846.jpeg",
  pastries: "https://api.patriacoffeebeans.com/api/uploads/1788859131220-888939291.jpg",
  pastry: "https://api.patriacoffeebeans.com/api/uploads/1788859131220-888939291.jpg",
  desserts: "https://api.patriacoffeebeans.com/api/uploads/1788860816181-469753541.jpg",
  dessert: "https://api.patriacoffeebeans.com/api/uploads/1788860816181-469753541.jpg",
  "cold-drinks": "https://api.patriacoffeebeans.com/api/uploads/1788860816240-642966281.jpg",
  "cold drinks": "https://api.patriacoffeebeans.com/api/uploads/1788860816240-642966281.jpg",
  sandwiches: "https://api.patriacoffeebeans.com/api/uploads/1788860816262-107208107.jpg",
  sandwich: "https://api.patriacoffeebeans.com/api/uploads/1788860816262-107208107.jpg",
};

const resolveCategoryImage = (category: PosCategory): string => {
  const idKey = (category.id || "").toLowerCase().trim();
  if (idKey === "all") return patriaLogo;

  const direct = (category.image || category.imageUrl || "").trim();
  if (direct && !direct.includes("unsplash.com")) return direct;

  const labelKey = (category.label || "").toLowerCase().trim();
  return (
    KNOWN_CATEGORY_FALLBACKS[idKey] ||
    KNOWN_CATEGORY_FALLBACKS[labelKey] ||
    patriaLogo
  );
};

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex gap-4 overflow-x-auto pt-2 pb-2 px-1 -mt-2 -mx-1 scrollbar-none">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const imageSrc = resolveCategoryImage(category);
        const isLogo = imageSrc === patriaLogo;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "group flex flex-1 min-w-[102px] shrink-0 flex-col items-center justify-center gap-2 rounded-[5px] bg-white px-3 py-6 transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-y-0.5",
              isActive
                ? "border-2 border-[#725400] shadow-xs"
                : "border border-[#CACBD4] hover:border-[#725400]/50 hover:shadow-xs",
            )}
          >
            <div className="flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5F0EA]">
              <img
                src={imageSrc}
                alt={category.label}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== patriaLogo) {
                    target.src = patriaLogo;
                  }
                }}
                className={cn(
                  "size-full transition-transform duration-300 group-hover:scale-105",
                  isLogo ? "object-contain p-2" : "object-cover"
                )}
              />
            </div>
            <span className="text-center text-[14px] font-medium leading-[14.98px] tracking-[0.28px] text-black whitespace-nowrap transition-colors duration-200 group-hover:text-primary">
              {t(category.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
