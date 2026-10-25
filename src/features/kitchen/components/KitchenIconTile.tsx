import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { KitchenIconOption } from "../icons";

interface KitchenIconTileProps {
  option: KitchenIconOption;
  selected: boolean;
  onClick: () => void;
}

const KitchenIconTile = ({
  option,
  selected,
  onClick,
}: KitchenIconTileProps) => {
  const { t } = useTranslation();
  const { Icon, label } = option;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[5px] p-3 outline outline-2 -outline-offset-2 transition-colors",
        selected
          ? "bg-[#FAFAF7] outline-primary"
          : "bg-[#F7F7F5] outline-[#E5E5E5] hover:outline-[#CACBD4]",
      )}
    >
      <Icon className="size-6 text-black" />
      <span
        className={cn(
          "text-center text-xs leading-3 tracking-tight text-black",
          selected ? "font-semibold" : "font-medium",
        )}
      >
        {t(label)}
      </span>
    </button>
  );
};

export default KitchenIconTile;
