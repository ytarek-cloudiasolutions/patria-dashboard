import { useState, useMemo, useCallback } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { HELP_SECTIONS } from "./helpCenterData";
import HelpCenterSidebar from "./components/HelpCenterSidebar";
import HelpCenterContent from "./components/HelpCenterContent";

const HelpCenterPage = () => {
  const { t } = useTranslation();

  // Default to the first topic of the first section
  const [selectedTopicId, setSelectedTopicId] = useState(
    HELP_SECTIONS[0]?.topics[0]?.id ?? ""
  );

  const handleSelectTopic = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Find the selected topic and its parent section
  const { topic, section } = useMemo(() => {
    for (const sec of HELP_SECTIONS) {
      const found = sec.topics.find((tp) => tp.id === selectedTopicId);
      if (found) return { topic: found, section: sec };
    }
    // Fallback to first
    return {
      topic: HELP_SECTIONS[0].topics[0],
      section: HELP_SECTIONS[0],
    };
  }, [selectedTopicId]);

  return (
    <>
      <div className="mb-6">
        <HeaderLayout
          title={t("System Overview")}
          description={t("Manage your account and platform preferences")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[439px_1fr] gap-4 items-start">
        <HelpCenterSidebar
          sections={HELP_SECTIONS}
          selectedTopicId={selectedTopicId}
          onSelectTopic={handleSelectTopic}
          className="lg:sticky lg:top-4 h-[500px] lg:h-[calc(100vh-220px)] lg:min-h-[550px] lg:max-h-[820px]"
        />
        <HelpCenterContent topic={topic} section={section} className="lg:min-h-[550px]" />
      </div>
    </>
  );
};

export default HelpCenterPage;
