import { LinkIcon, LogOut, ShieldCheck, Zap } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
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
  const isConnected = status === "connected";

  return (
    <GatewayCard
      title="Connections"
      icon={<Zap size={24} className="text-[#000000]" />}
      className={className}
      contentClassName="flex flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-6 sm:py-12"
    >
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
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[20px] font-bold text-[#333333]">
          {isConnected ? "Securely Connected" : "Not Connected"}
        </h4>
        <p className="text-[14px] text-[#595959]">
          {isConnected
            ? "The system is ready to send OTPs through your device."
            : "Link your device to start sending OTPs and notifications."}
        </p>
      </div>
      {isConnected ? (
        <DefaultButton
          data={{
            buttonText: "Disconnect Account",
            icon: <LogOut className="size-4.5" />,
            onClick: onDisconnect,
            className:
              "mt-2 bg-[#FFF0F0] text-[#C90000] hover:bg-[#FCE3E3] hover:text-[#C90000]",
          }}
        />
      ) : (
        <DefaultButton
          data={{
            buttonText: "Link Account",
            icon: <LinkIcon className="size-4.5" />,
            onClick: onConnect,
            className: "mt-2",
          }}
        />
      )}
    </GatewayCard>
  );
};

export default ConnectionStatusCard;
