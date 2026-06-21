import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PermissionPage } from "../types";
import { PAGE_ICONS } from "../pageIcons";

interface PageChipProps {
  page: PermissionPage;
}

const PageChip = ({ page }: PageChipProps) => {
  const { t } = useTranslation();
  const { icon: Icon, color } = PAGE_ICONS[page];
  return (
    <span className="inline-flex items-center gap-1 rounded-[30px] border border-[#E5E5E5] bg-white px-2 py-0.5 text-[10px] font-semibold text-black">
      <Icon size={12} className={color} />
      {t(page)}
    </span>
  );
};

export default PageChip;
