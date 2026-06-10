import { useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";

import ConnectionStatusCard from "./components/ConnectionStatusCard";
import GatewaySecurityCard from "./components/GatewaySecurityCard";
import HowToLinkCard from "./components/HowToLinkCard";
import NeedHelpCard from "./components/NeedHelpCard";
import TechnicalPerformanceCard from "./components/TechnicalPerformanceCard";

import { LINK_STEPS, PERFORMANCE_METRICS, SECURITY_LAST_AUDIT } from "./data";
import type { GatewayConnectionStatus } from "./types";

const WhatsAppGatewayPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<GatewayConnectionStatus>("connected");
  const isConnected = status === "connected";

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("WhatsApp Gateway")}
          description={t("Link your device for internal OTP & Notifications")}
        />
        <Badge
          className={`h-7 gap-1.5 rounded-full border px-3 py-0 text-[12px] font-semibold ${
            isConnected
              ? "border-current bg-[#E2F4ED] text-[#059B5A]"
              : "border-current bg-[#FFF0F0] text-[#C90000]"
          }`}
        >
          {isConnected ? t("Connected") : t("Disconnected")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ConnectionStatusCard
            status={status}
            onDisconnect={() => setStatus("disconnected")}
            onConnect={() => setStatus("connected")}
            className="flex-1"
          />
          <TechnicalPerformanceCard metrics={PERFORMANCE_METRICS} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <HowToLinkCard steps={LINK_STEPS} />
          <GatewaySecurityCard lastAudit={SECURITY_LAST_AUDIT} />
          <NeedHelpCard className="flex-1" />
        </div>
      </div>
    </>
  );
};

export default WhatsAppGatewayPage;
