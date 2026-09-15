import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { HelpSection } from "../helpCenterData";

interface HelpCenterSidebarProps {
  sections: HelpSection[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  className?: string;
}

const HelpCenterSidebar = ({
  sections,
  selectedTopicId,
  onSelectTopic,
  className,
}: HelpCenterSidebarProps) => {
  const { t, language, dir } = useTranslation();
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase().trim();
    return sections
      .map((section) => ({
        ...section,
        topics: section.topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(query) ||
            topic.titleAr.includes(query)
        ),
      }))
      .filter((section) => section.topics.length > 0);
  }, [sections, searchQuery]);

  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-[16px] border border-[#E5E5E5] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden",
        className || "h-[calc(100vh-220px)] min-h-[550px] max-h-[820px]"
      )}
    >
      {/* Search field */}
      <div className="px-3 pt-[18px] pb-3 shrink-0">
        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-white rounded-lg border border-[#CACBD4]">
          <Search className="size-5 shrink-0 text-[#8B8B8B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search for topic")}
            className="flex-1 text-[16px] font-normal text-black placeholder:text-[#8B8B8B] outline-none bg-transparent tracking-[0.32px]"
          />
        </div>
      </div>

      {/* Topics list */}
      <ScrollArea dir={dir} className="flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-3 pt-2 pb-4 px-3">
          {filteredSections.length === 0 ? (
            <p className="text-center text-[13px] text-[#8B8B8B] py-8">
              {t("No topics found.")}
            </p>
          ) : (
            filteredSections.map((section, sectionIdx) => (
              <div key={section.id}>
                {/* Separator between sections */}
                {sectionIdx > 0 && (
                  <div className="h-px bg-[#CACBD4] mb-3" />
                )}

                {/* Section */}
                <div className="flex flex-col gap-2">
                  {/* Section title */}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2px] text-[#595959] pe-[11px]">
                    {isAr ? section.titleAr : section.title}
                  </span>

                  {/* Topics */}
                  {section.topics.map((topic) => {
                    const isSelected = selectedTopicId === topic.id;
                    const Icon = topic.icon;

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => onSelectTopic(topic.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-1.5 py-2 rounded-[16px] transition-colors cursor-pointer text-start w-full",
                          isSelected
                            ? "bg-[#F5F0EA]"
                            : "hover:bg-[#F5F0EA]/60"
                        )}
                      >
                        <Icon className="size-4 shrink-0 text-black" />
                        <span className="text-[11px] font-medium tracking-[0.22px] text-black leading-snug">
                          {isAr ? topic.titleAr : topic.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpCenterSidebar;
