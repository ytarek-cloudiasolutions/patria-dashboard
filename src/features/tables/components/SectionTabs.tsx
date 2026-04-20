import { Button } from "@/shared/components/ui/button";
import { TABLE_SECTIONS } from "../data";
import type { SectionTabsProps } from "../types";

const SectionTabs = ({ activeSection, onSectionChange }: SectionTabsProps) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-1 md:grid-cols-4">
      {TABLE_SECTIONS.map((section) => {
        const isActive = section === activeSection;

        return (
          <Button
            key={section}
            type="button"
            variant="ghost"
            size="default"
            onClick={() => onSectionChange(section)}
            className={`relative h-auto w-full rounded-none pb-3 text-center text-[16px] transition-colors ${
              isActive
                ? "text-[#333333] font-semibold"
                : "text-[#8B8B8B] hover:text-[#333333] hover:font-semibold"
            }`}
          >
            {section}
            <span
              className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition-all ${
                isActive ? "bg-primary" : "bg-[#8B8B8B]"
              }`}
            />
          </Button>
        );
      })}
    </div>
  );
};

export default SectionTabs;
