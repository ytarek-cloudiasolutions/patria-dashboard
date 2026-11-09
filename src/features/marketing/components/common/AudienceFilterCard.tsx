import { AudienceSegmentCards } from "./AudienceSegmentCards";
import { GenderSelector } from "./GenderSelector";
import { CategoryInterestChips } from "./CategoryInterestChips";
import { AudienceSummaryBadges } from "./AudienceSummaryBadges";
import type { AudienceCriteria, AudienceSegment } from "../../types";
import type { AudienceSegmentCounts } from "../../api/marketingApi";
import { cn } from "@/lib/utils";

interface AudienceFilterCardProps {
  criteria: AudienceCriteria;
  onCriteriaChange: (updater: (prev: AudienceCriteria) => AudienceCriteria) => void;
  className?: string;
  segmentCounts?: AudienceSegmentCounts;
  targetCount?: number;
}

export const AudienceFilterCard = ({
  criteria,
  onCriteriaChange,
  className,
  segmentCounts,
  targetCount,
}: AudienceFilterCardProps) => {
  const handleSelectSegment = (segment: AudienceSegment) => {
    onCriteriaChange((prev) => ({ ...prev, segment }));
  };

  const handleSelectGender = (gender: AudienceCriteria["gender"]) => {
    onCriteriaChange((prev) => ({ ...prev, gender }));
  };

  const handleToggleInterest = (categoryId: string) => {
    onCriteriaChange((prev) => {
      const exists = prev.interests.includes(categoryId);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((c) => c !== categoryId)
          : [...prev.interests, categoryId],
      };
    });
  };

  return (
    <div
      className={cn(
        "w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col gap-4 overflow-hidden",
        className
      )}
    >
      {/* 6 Segments Grid with live backend counts */}
      <AudienceSegmentCards
        selectedSegment={criteria.segment}
        onSelectSegment={handleSelectSegment}
        counts={segmentCounts}
      />

      {/* Gender Selector */}
      <GenderSelector selectedGender={criteria.gender} onSelectGender={handleSelectGender} />

      {/* Interests Multi-Select */}
      <CategoryInterestChips
        selectedInterests={criteria.interests}
        onToggleInterest={handleToggleInterest}
      />

      {/* Separator before footer badges */}
      <div className="w-full h-px bg-[#CACBD4]" />

      {/* Summary Badge — real count for the exact combination currently selected */}
      <AudienceSummaryBadges customerCount={targetCount} />
    </div>
  );
};
