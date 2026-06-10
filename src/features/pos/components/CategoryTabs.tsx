import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PosCategory } from "../types";

type CategoryTabsProps = {
  categories: PosCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
};

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex h-[88px] w-[104px] shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border bg-white px-2 transition-colors",
              isActive
                ? "border-primary bg-[#FBF6EE]"
                : "border-[#EDEBE7] hover:border-primary/50",
            )}
          >
            <span className="size-10 overflow-hidden rounded-full bg-[#F3EEE7]">
              <img
                src={category.imageUrl}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </span>
            <span
              className={cn(
                "line-clamp-1 text-center text-[11px] font-semibold",
                isActive ? "text-primary" : "text-[#595959]",
              )}
            >
              {t(category.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
