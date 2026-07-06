import { LinkIcon, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { Zap } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import GatewayCard from "./GatewayCard";
import type { GatewayConnectionStatus } from "../types";

interface ConnectionStatusCardProps {
  status: GatewayConnectionStatus;
  qrDataUrl?: string | null;
  isLoading?: boolean;
  onDisconnect: () => void;
  onConnect: () => void;
  className?: string;
}

const ConnectionStatusCard = ({
  status,
  qrDataUrl,
  isLoading,
  onDisconnect,
  onConnect,
  className,
}: ConnectionStatusCardProps) => {
  const { t } = useTranslation();
  const isConnected = status === "connected";

  // Show QR code if available
  if (qrDataUrl && !isConnected) {
    return (
      <GatewayCard
        title={t("Connections")}
        icon={<Zap size={24} className="text-[#000000]" />}
        className={className}
        contentClassName="flex flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-6 sm:py-12"
      >
        <h4 className="text-[18px] font-bold text-[#333333]">
          {t("Scan QR Code with WhatsApp")}
        </h4>
        <p className="text-[13px] text-[#595959]">
          {t("Open WhatsApp → Settings → Linked Devices → Link a Device")}
        </p>
        <img
          src={qrDataUrl}
          alt="WhatsApp QR Code"
          className="h-[240px] w-[240px] rounded-[12px] border border-[#E5E2DD] p-2"
        />
        <p className="text-[12px] text-[#8B8B8B]">
          {t("Page updates automatically every 4 seconds")}
        </p>
      </GatewayCard>
    );
  }

  return (
    <GatewayCard
      title={t("Connections")}
      icon={<Zap size={24} className="text-[#000000]" />}
      className={className}
      contentClassName="flex flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-6 sm:py-12"
    >
      <span
        className={`flex size-34.5 items-center justify-center rounded-[32px] ${
          isConnected ? "bg-[#E2F4ED]" : "bg-[#FFF0F0]"
        }`}
      >
        {isLoading ? (
          <Loader2 size={90} className="animate-spin text-[#8B8B8B]" />
        ) : (
          <ShieldCheck
            size={90}
            className={isConnected ? "text-[#059B5A]" : "text-[#C90000]"}
          />
        )}
      </span>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[20px] font-bold text-[#333333]">
          {isLoading
            ? t("Initializing...")
            : isConnected
              ? t("Securely Connected")
              : t("Not Connected")}
        </h4>
        <p className="text-[14px] text-[#595959]">
          {isLoading
            ? t("Setting up WhatsApp connection, please wait...")
            : isConnected
              ? t("The system is ready to send OTPs through your device.")
              : t("Link your device to start sending OTPs and notifications.")}
        </p>
      </div>
      {isConnected ? (
        <DefaultButton
          data={{
            buttonText: t("Disconnect Account"),
            icon: <LogOut className="size-4.5" />,
            onClick: onDisconnect,
            className:
              "mt-2 bg-[#FFF0F0] text-[#C90000] hover:bg-[#FCE3E3] hover:text-[#C90000]",
          }}
        />
      ) : (
        !isLoading && (
          <DefaultButton
            data={{
              buttonText: t("Link Account"),
              icon: <LinkIcon className="size-4.5" />,
              onClick: onConnect,
              className: "mt-2",
            }}
          />
        )
      )}
    </GatewayCard>
  );
};

export default ConnectionStatusCard;
