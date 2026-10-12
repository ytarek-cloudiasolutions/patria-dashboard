import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { POS_PERMISSIONS } from "../data";

interface PosPermissionsCardProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const PosPermissionsCard = ({ selected, onChange }: PosPermissionsCardProps) => {
  const { t } = useTranslation();

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="w-full px-4 py-4 bg-[#FAFAF7] rounded-2xl border border-[#E5E5E5] flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-[#28293D] text-base font-semibold font-['Montserrat'] leading-4 tracking-tight">
          {t("Detailed POS Permissions")}
        </span>
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#8F6900] p-3">
        {POS_PERMISSIONS.map((perm) => {
          const isSelected = selected.includes(perm.id);
          return (
            <button
              key={perm.id}
              type="button"
              onClick={() => toggle(perm.id)}
              className={cn(
                "w-full px-4 py-3.5 rounded-2xl border-2 flex items-center gap-3 text-left transition-all",
                isSelected
                  ? "bg-[#F5F0EA] border-[#8F6900]"
                  : "bg-[#FAFAF7] border-[#E5E5E5]",
              )}
            >
              {/* Radio dot */}
              <span className="shrink-0 size-3.5 relative flex items-center justify-center">
                <span
                  className={cn(
                    "size-3.5 rounded-full border transition-all",
                    isSelected
                      ? "bg-[#8F6900] border-[#8F6900] outline outline-[2.80px] outline-yellow-900/10"
                      : "border-[#8B8B8B]",
                  )}
                />
              </span>

              {/* Text */}
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-[#28293D] text-xs font-medium font-['Montserrat'] leading-3 tracking-tight">
                  {t(perm.title)}
                </span>
                <span className="text-[#8B8B8B] text-xs font-normal font-['Montserrat'] leading-4 tracking-tight">
                  {t(perm.description)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PosPermissionsCard;
