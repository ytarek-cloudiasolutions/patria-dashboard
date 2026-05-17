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
    <div className="min-h-screen bg-[#FCFCFB] px-5 py-8 md:px-6 lg:px-8 xl:px-[22px] xl:py-[49px]">
      <div className="w-full">
        <div className="mb-[31px] flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[38px] font-bold leading-[1.1] text-[#333333]">
              WhatsApp Gateway
            </h1>
            <p className="mt-[5px] text-[19px] font-medium text-[#696969]">
              Link your device for internal OTP &amp; Notifications
            </p>
          </div>

          <span
            className={cn(
              "mt-[18px] inline-flex h-[28px] items-center rounded-full border px-[15px] text-[16px] font-semibold leading-none",
              isConnected
                ? "border-[#00A85A] bg-[#DDF6EB] text-[#00A85A]"
                : "border-[#F5A8A8] bg-[#FFF0F0] text-[#C90000]"
            )}
          >
            {connectionStatus}
          </span>
        </div>

        <div className="grid gap-[35px] xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="flex min-w-0 flex-col gap-[26px]">
            <ConnectionPanel
              status={connectionStatus}
              onDisconnect={handleDisconnect}
            />
            <TechnicalPerformancePanel data={TECHNICAL_PERFORMANCE} />
          </div>

          <div className="flex min-w-0 flex-col gap-[26px]">
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
