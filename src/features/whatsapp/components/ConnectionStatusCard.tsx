import { useEffect, useRef, useState } from "react";
import { LinkIcon, Loader2, LogOut, ShieldCheck, Zap } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import GatewayCard from "./GatewayCard";
import type { GatewayConnectionStatus } from "../types";

interface ConnectionStatusCardProps {
  status: GatewayConnectionStatus;
  onDisconnect: () => void;
  onConnect: () => void;
  className?: string;
}

const ConnectionStatusCard = ({
  status,
  onDisconnect,
  onConnect,
  className,
}: ConnectionStatusCardProps) => {
  const { t } = useTranslation();
  const isConnected = status === "connected";
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    if (isConnected) {
      stopPolling();
      setQrDataUrl(null);
      setIsInitializing(false);
    }
  }, [isConnected]);

  useEffect(() => () => stopPolling(), []);

  const handleLink = async () => {
    setIsInitializing(true);
    setQrDataUrl(null);
    try {
      await api.post("/whatsapp/init");
    } catch {
      // init may return error if already initializing — safe to ignore
    }
    // Poll every 3 seconds for QR / connected status
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get("/whatsapp/qr-data");
        const { status: s, qrDataUrl: qr } = res.data ?? {};
        if (s === "connected") {
          stopPolling();
          setQrDataUrl(null);
          setIsInitializing(false);
          onConnect();
        } else if (qr) {
          setQrDataUrl(qr);
          setIsInitializing(false);
        }
      } catch {
        // ignore transient errors
      }
    }, 3000);
  };

  const handleDisconnect = async () => {
    stopPolling();
    setQrDataUrl(null);
    setIsInitializing(false);
    try { await api.post("/whatsapp/disconnect"); } catch { /* ignore */ }
    onDisconnect();
  };

  return (
    <GatewayCard
      title={t("Connections")}
      icon={<Zap size={24} className="text-[#000000]" />}
      className={className}
      contentClassName="flex flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-6 sm:py-12"
    >
      {qrDataUrl ? (
        <>
          <img
            src={qrDataUrl}
            alt="WhatsApp QR"
            className="size-52 rounded-[12px] border border-[#E5E2DD]"
          />
          <p className="text-[14px] text-[#595959]">
            {t("Scan this QR code with WhatsApp on your phone")}
          </p>
        </>
      ) : (
        <span
          className={`flex size-34.5 items-center justify-center rounded-[32px] ${
            isConnected ? "bg-[#E2F4ED]" : "bg-[#FFF0F0]"
          }`}
        >
          <ShieldCheck
            size={90}
            className={isConnected ? "text-[#059B5A]" : "text-[#C90000]"}
          />
        </span>
      )}

      {!qrDataUrl && (
        <div className="flex flex-col gap-1.5">
          <h4 className="text-[20px] font-bold text-[#333333]">
            {isConnected ? t("Securely Connected") : isInitializing ? t("Initializing...") : t("Not Connected")}
          </h4>
          <p className="text-[14px] text-[#595959]">
            {isConnected
              ? t("The system is ready to send OTPs through your device.")
              : isInitializing
              ? t("Starting WhatsApp client, please wait...")
              : t("Link your device to start sending OTPs and notifications.")}
          </p>
        </div>
      )}

      {isConnected ? (
        <DefaultButton
          data={{
            buttonText: t("Disconnect Account"),
            icon: <LogOut className="size-4.5" />,
            onClick: handleDisconnect,
            className: "mt-2 bg-[#FFF0F0] text-[#C90000] hover:bg-[#FCE3E3] hover:text-[#C90000]",
          }}
        />
      ) : !qrDataUrl ? (
        <DefaultButton
          data={{
            buttonText: isInitializing ? t("Waiting for QR...") : t("Link Account"),
            icon: isInitializing
              ? <Loader2 className="size-4.5 animate-spin" />
              : <LinkIcon className="size-4.5" />,
            onClick: isInitializing ? () => {} : handleLink,
            className: "mt-2",
          }}
        />
      ) : null}
    </GatewayCard>
  );
};

export default ConnectionStatusCard;
