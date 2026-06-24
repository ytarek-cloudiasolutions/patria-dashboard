import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { TABLE_SECTIONS } from "../data";
import { SECTION_DISPLAY_NAMES } from "../types";
import type { TableSection } from "../store/tableTypes";

interface TablesTabsProps {
  active: TableSection;
  onChange: (section: TableSection) => void;
}

const TablesTabs = ({ active, onChange }: TablesTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {TABLE_SECTIONS.map((section) => (
        <TabItem
          key={section}
          value={section}
          label={t(SECTION_DISPLAY_NAMES[section])}
          isActive={active === section}
          onClick={(value) => onChange(value as TableSection)}
        />
      ))}
    </div>
  );
};

export default TablesTabs;
