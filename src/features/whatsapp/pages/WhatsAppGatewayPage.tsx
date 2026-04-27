import { useState } from "react";

import ConnectionPanel from "../components/ConnectionPanel";
import TechnicalPerformancePanel from "../components/TechnicalPerformancePanel";
import HowToLinkPanel from "../components/HowToLinkPanel";
import GatewaySecurityPanel from "../components/GatewaySecurityPanel";
import NeedHelpPanel from "../components/NeedHelpPanel";
import { cn } from "@/lib/utils";
import {
  TECHNICAL_PERFORMANCE,
  HOW_TO_LINK_STEPS,
  GATEWAY_SECURITY,
} from "../data";
import type { ConnectionStatus } from "../types";

const WhatsAppGatewayPage = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("Connected");

  const handleDisconnect = () => {
    // TODO: call disconnect API
    setConnectionStatus("Disconnected");
  };

  const isConnected = connectionStatus === "Connected";

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">
              WhatsApp Gateway
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Link your device for internal OTP &amp; Notifications
            </p>
          </div>

          {/* Connection status badge */}
          <span
            className={cn(
              "rounded-full border px-4 py-1.5 text-[13px] font-semibold",
              isConnected
                ? "border-[#A8DFC4] bg-[#E8F5EE] text-[#1A7A45]"
                : "border-[#F5A8A8] bg-[#FFF0F0] text-[#C90000]"
            )}
          >
            {connectionStatus}
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <ConnectionPanel
              status={connectionStatus}
              onDisconnect={handleDisconnect}
            />
            <TechnicalPerformancePanel data={TECHNICAL_PERFORMANCE} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <HowToLinkPanel steps={HOW_TO_LINK_STEPS} />
            <GatewaySecurityPanel data={GATEWAY_SECURITY} />
            <NeedHelpPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGatewayPage;
