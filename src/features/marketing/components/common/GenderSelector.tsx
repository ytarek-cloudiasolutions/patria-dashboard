import { cn } from "@/lib/utils";
import type { GenderFilter } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface GenderSelectorProps {
  selectedGender: GenderFilter;
  onSelectGender: (gender: GenderFilter) => void;
  className?: string;
}

export const GenderSelector = ({
  selectedGender,
  onSelectGender,
  className,
}: GenderSelectorProps) => {
  const { t } = useTranslation();

  const options: { id: GenderFilter; label: string }[] = [
    { id: "all", label: t("All") },
    { id: "women", label: t("Women") },
    { id: "men", label: t("Men") },
  ];

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <div>
        <span className="text-[#1A1A1A] text-[14px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
          {t("Gender")}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {options.map((opt) => {
          const isSelected = selectedGender === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectGender(opt.id)}
              className={cn(
                "px-2 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex items-center justify-center cursor-pointer transition-all",
                isSelected
                  ? "bg-[#F5F0EA] outline-[#8F6900] text-black font-semibold text-sm"
                  : "bg-white outline-[#CACBD4] hover:outline-[#8F6900]/50 text-black font-medium text-sm"
              )}
            >
              <span className="font-['Montserrat',sans-serif] leading-4 tracking-tight">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
