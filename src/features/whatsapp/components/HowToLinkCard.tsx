import { Smartphone } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import GatewayCard from "./GatewayCard";
import type { LinkStep } from "../types";

interface HowToLinkCardProps {
  steps: LinkStep[];
}

const HowToLinkCard = ({ steps }: HowToLinkCardProps) => {
  const { t } = useTranslation();
  return (
    <GatewayCard
      title={t("How to link?")}
      icon={<Smartphone size={24} className="text-[#28293D]" />}
      contentClassName="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6"
    >
      {steps.map((step) => (
        <div
          key={step.id}
          className="group/step flex items-center gap-3 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors duration-150 hover:bg-[#FAF7F2]/80"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-white transition-transform duration-200 group-hover/step:scale-110">
            {step.id}
          </span>
          <p className="text-[13px] font-semibold text-[#000000]">{t(step.text)}</p>
        </div>
      ))}
    </GatewayCard>
  );
};

export default HowToLinkCard;
