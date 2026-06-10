import { ShieldCheck } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import GatewayCard from "./GatewayCard";

interface GatewaySecurityCardProps {
  lastAudit: string;
}

const GatewaySecurityCard = ({ lastAudit }: GatewaySecurityCardProps) => {
  const { t } = useTranslation();
  return (
    <GatewayCard
      title={t("Gateway Security")}
      icon={<ShieldCheck size={24} className="text-[#28293D]" />}
      contentClassName="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#E5E5E5] px-4 py-4">
        <p className="text-[16px] font-semibold text-[#000000]">{t("Session Isolation")}</p>
        <p className="text-[13px] leading-relaxed font-medium text-[#28293D]">
          {t("Your WhatsApp messages are never stored on our database. We only handle the delivery socket.")}
        </p>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <p className="text-[13px] font-semibold text-[#000000]">
          {t("System compliant with WhatsApp security protocols.")}
        </p>
        <p className="text-[13px] font-medium text-[#000000]">
          {t("Last audit:")} <span dir="ltr">{lastAudit}</span>
        </p>
      </div>
    </GatewayCard>
  );
};

export default GatewaySecurityCard;
