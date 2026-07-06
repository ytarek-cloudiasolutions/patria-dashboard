import { useCallback, useEffect, useRef, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";

import ConnectionStatusCard from "./components/ConnectionStatusCard";
import GatewaySecurityCard from "./components/GatewaySecurityCard";
import HowToLinkCard from "./components/HowToLinkCard";
import NeedHelpCard from "./components/NeedHelpCard";
import TechnicalPerformanceCard from "./components/TechnicalPerformanceCard";

import { LINK_STEPS, SECURITY_LAST_AUDIT } from "./data";
import type { GatewayConnectionStatus, PerformanceMetric } from "./types";

const WhatsAppGatewayPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<GatewayConnectionStatus>("loading");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isConnected = status === "connected";

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get<{ status: string; qrDataUrl: string | null }>(
        "/whatsapp/qr-data",
      );
      const s = res.data.status as GatewayConnectionStatus;
      setStatus(s === "connected" ? "connected" : s === "qr_ready" ? "qr_ready" : "disconnected");
      setQrDataUrl(res.data.qrDataUrl ?? null);
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll every 4s when waiting for QR scan
  useEffect(() => {
    if (status === "qr_ready" || status === "loading") {
      pollRef.current = setInterval(fetchStatus, 4000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status, fetchStatus]);

  const handleConnect = async () => {
    try {
      setStatus("loading");
      await api.post("/whatsapp/init");
      // Start polling — QR will appear after a few seconds
      await new Promise((r) => setTimeout(r, 2000));
      await fetchStatus();
    } catch {
      setStatus("disconnected");
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post("/whatsapp/disconnect");
      setStatus("disconnected");
      setQrDataUrl(null);
    } catch {
      setStatus("disconnected");
    }
  };

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: "wa-status",
      label: "Gateway Status",
      value:
        status === "connected"
          ? "Connected"
          : status === "qr_ready"
            ? "Awaiting Scan"
            : status === "loading"
              ? "Initializing..."
              : "Offline",
      tone: status === "connected" ? "positive" : status === "qr_ready" ? "highlight" : "neutral",
    },
    {
      id: "queue-status",
      label: "Queue Status",
      value: status === "connected" ? "Ready" : "Idle",
      tone: status === "connected" ? "positive" : "neutral",
    },
    {
      id: "encryption",
      label: "Encryption",
      value: "End-to-End",
      tone: "highlight",
    },
  ];

  const badgeClass = isConnected
    ? "border-current bg-[#E2F4ED] text-[#059B5A]"
    : status === "qr_ready"
      ? "border-current bg-[#FFF8E1] text-[#B45309]"
      : "border-current bg-[#FFF0F0] text-[#C90000]";

  const badgeLabel = isConnected
    ? t("Connected")
    : status === "qr_ready"
      ? t("Scan QR Code")
      : t("Disconnected");

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("WhatsApp Gateway")}
          description={t("Link your device for internal OTP & Notifications")}
        />
        <Badge
          className={`h-7 gap-1.5 rounded-full border px-3 py-0 text-[12px] font-semibold ${badgeClass}`}
        >
          {badgeLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ConnectionStatusCard
            status={isConnected ? "connected" : "disconnected"}
            qrDataUrl={qrDataUrl}
            isLoading={status === "loading"}
            onDisconnect={handleDisconnect}
            onConnect={handleConnect}
            className="flex-1"
          />
          <TechnicalPerformanceCard metrics={performanceMetrics} />
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
