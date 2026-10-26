import { cn } from "@/lib/utils";
import { CATEGORY_INTERESTS } from "../../data";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface CategoryInterestChipsProps {
  selectedInterests: string[];
  onToggleInterest: (category: string) => void;
  className?: string;
}

export const CategoryInterestChips = ({
  selectedInterests,
  onToggleInterest,
  className,
}: CategoryInterestChipsProps) => {
  const { t } = useTranslation();

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
        {CATEGORY_INTERESTS.map((cat) => {
          const isSelected = selectedInterests.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggleInterest(cat)}
              className={cn(
                "h-9 px-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] inline-flex items-center justify-center cursor-pointer transition-all",
                isSelected
                  ? "bg-[#F5F0EA] outline-[#8F6900] text-black font-semibold text-xs"
                  : "bg-white outline-[#CACBD4] hover:outline-[#8F6900]/50 text-[#1A1A1A] font-normal text-xs"
              )}
            >
              <span className="font-['Montserrat',sans-serif] whitespace-nowrap">
                {t(cat)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
