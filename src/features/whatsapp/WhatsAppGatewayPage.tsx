import { useEffect, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";

import ConnectionStatusCard from "./components/ConnectionStatusCard";
import GatewaySecurityCard from "./components/GatewaySecurityCard";
import HowToLinkCard from "./components/HowToLinkCard";
import NeedHelpCard from "./components/NeedHelpCard";
import TechnicalPerformanceCard from "./components/TechnicalPerformanceCard";

import { LINK_STEPS } from "./data";
import type { GatewayConnectionStatus, PerformanceMetric } from "./types";

const WhatsAppGatewayPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<GatewayConnectionStatus>("disconnected");
  const [connectedSince, setConnectedSince] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const isConnected = status === "connected";

  useEffect(() => {
    api
      .get("/whatsapp/status")
      .then((res) => {
        const s = res.data?.status ?? res.data?.state ?? "";
        const connected = s === "connected" || s === "CONNECTED";
        setStatus(connected ? "connected" : "disconnected");
        setConnectedSince(
          connected && res.data?.connectedAt
            ? new Date(res.data.connectedAt).toLocaleString()
            : null,
        );
        setMetrics([
          {
            id: "response-time",
            label: "Avg. Response Time",
            value: res.data?.avgLatencyMs != null ? `${res.data.avgLatencyMs}ms` : t("No data yet"),
            tone: "neutral",
          },
          {
            id: "queue-status",
            label: "Connection Status",
            value: connected ? t("Active") : t("Disconnected"),
            tone: connected ? "positive" : "neutral",
          },
          {
            id: "messages",
            label: "Messages Sent / Failed",
            value: `${res.data?.messagesSent ?? 0} / ${res.data?.messagesFailed ?? 0}`,
            tone: "highlight",
          },
        ]);
      })
      .catch(() => {
        setStatus("disconnected");
        setConnectedSince(null);
        setMetrics([]);
      });
  }, [t]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("WhatsApp Gateway")}
          description={t("Link your device for internal OTP & Notifications")}
        />
        <Badge
          className={`h-7 gap-1.5 rounded-[30px] border px-3 py-0 text-[12px] font-semibold ${
            isConnected
              ? "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]"
              : "border-[#C90000] bg-[#FFF0F0] text-[#C90000]"
          }`}
        >
          {isConnected ? t("Connected") : t("Disconnected")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ConnectionStatusCard
            status={status}
            onDisconnect={() => setStatus("disconnected")}
            onConnect={() => setStatus("connected")}
            className="flex-1"
          />
          <TechnicalPerformanceCard metrics={metrics} />
        </div>

        <div className="flex flex-col gap-4">
          <HowToLinkCard steps={LINK_STEPS} />
          <GatewaySecurityCard connectedSince={connectedSince} />
          <NeedHelpCard className="flex-1" />
        </div>
      </div>
    </>
  );
};

export default WhatsAppGatewayPage;
