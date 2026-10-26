import { AudienceSegmentCards } from "./AudienceSegmentCards";
import { GenderSelector } from "./GenderSelector";
import { CategoryInterestChips } from "./CategoryInterestChips";
import { AudienceSummaryBadges } from "./AudienceSummaryBadges";
import type { AudienceCriteria } from "../../types";
import { cn } from "@/lib/utils";

interface AudienceFilterCardProps {
  criteria: AudienceCriteria;
  onCriteriaChange: (updater: (prev: AudienceCriteria) => AudienceCriteria) => void;
  className?: string;
  customerCount?: number;
  deviceCount?: number;
  womenCount?: number;
  menCount?: number;
}

export const AudienceFilterCard = ({
  criteria,
  onCriteriaChange,
  className,
  customerCount = 12,
  deviceCount = 8,
  womenCount = 7,
  menCount = 1,
}: AudienceFilterCardProps) => {
  const handleSelectSegment = (segment: AudienceCriteria["segment"]) => {
    onCriteriaChange((prev) => ({ ...prev, segment }));
  };

  const handleInactiveDaysChange = (inactiveDays: number) => {
    onCriteriaChange((prev) => ({ ...prev, inactiveDays }));
  };

  const handleSelectGender = (gender: AudienceCriteria["gender"]) => {
    onCriteriaChange((prev) => ({ ...prev, gender }));
  };

  const handleToggleInterest = (category: string) => {
    onCriteriaChange((prev) => {
      const exists = prev.interests.includes(category);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((c) => c !== category)
          : [...prev.interests, category],
      };
    });
  };

  return (
    <div
      className={cn(
        "w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col gap-4 overflow-hidden",
        className
      )}
    >
      {/* 6 Segments Grid with dynamic day adjuster */}
      <AudienceSegmentCards
        selectedSegment={criteria.segment}
        onSelectSegment={handleSelectSegment}
        inactiveDays={criteria.inactiveDays}
        onInactiveDaysChange={handleInactiveDaysChange}
      />

      {/* Gender Selector */}
      <GenderSelector
        selectedGender={criteria.gender}
        onSelectGender={handleSelectGender}
      />

      {/* Interests Multi-Select */}
      <CategoryInterestChips
        selectedInterests={criteria.interests}
        onToggleInterest={handleToggleInterest}
      />

      {/* Separator before footer badges */}
      <div className="w-full h-px bg-[#CACBD4]" />

      {/* Summary Badges */}
      <AudienceSummaryBadges
        customerCount={customerCount}
        deviceCount={deviceCount}
        womenCount={womenCount}
        menCount={menCount}
      />
    </div>
  );
};
