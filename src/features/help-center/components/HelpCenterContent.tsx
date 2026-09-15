import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { HelpTopic, HelpSection } from "../helpCenterData";

interface HelpCenterContentProps {
  topic: HelpTopic;
  section: HelpSection;
  className?: string;
}

const HelpCenterContent = ({ topic, section, className }: HelpCenterContentProps) => {
  const { language } = useTranslation();
  const isAr = language === "ar";

  const Icon = topic.icon;
  const title = isAr ? topic.titleAr : topic.title;
  const sectionTitle = isAr ? section.titleAr : section.title;
  const steps = isAr ? topic.stepsAr : topic.steps;

  return (
    <div className={cn("flex flex-col gap-6 bg-white rounded-[16px] border border-[#E5E5E5] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] p-6 min-h-[500px] overflow-auto", className)}>
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Icon className="size-[18px] shrink-0 text-[#8F6900]" />
          <h2 className="text-[24px] font-bold text-[#333333] leading-[25.68px] tracking-[0.48px]">
            {title}
          </h2>
        </div>
        <p className="text-[13px] font-normal text-[#595959] leading-[18.2px] tracking-[0.26px] ps-[26px]">
          {sectionTitle}
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {/* Number badge */}
            <div className="size-6 shrink-0 rounded-full bg-[#F5F0EA] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#8F6900] leading-[10.7px] tracking-[0.2px]">
                {idx + 1}
              </span>
            </div>

            {/* Step text */}
            <p className="flex-1 text-[11px] font-normal text-black tracking-[0.22px] leading-[18px] pt-[3px]">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenterContent;
