import { Check, LogOut, Shield, Zap } from "lucide-react";
import type { ConnectionStatus } from "../types";

interface ConnectionPanelProps {
  status: ConnectionStatus;
  onDisconnect: () => void;
}

const ConnectionPanel = ({ status, onDisconnect }: ConnectionPanelProps) => {
  const isConnected = status === "Connected";

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
      <div className="flex h-[55px] items-center justify-between bg-[#F5F0EA] px-[20px]">
        <h2 className="text-[20px] font-bold text-[#333333]">Connections</h2>
        <Zap className="size-7 text-[#000000]" strokeWidth={1.8} />
      </div>

      {isConnected ? (
        <div className="flex min-h-[467px] flex-col items-center justify-center px-6 pb-[52px] pt-[55px] text-center">
          <div className="relative mb-[35px] flex size-[160px] items-center justify-center rounded-[32px] bg-[#DDF6EB]">
            <Shield className="size-[92px] text-[#00A85A]" strokeWidth={2.4} />
            <Check
              className="absolute size-[36px] translate-y-[6px] text-[#00A85A]"
              strokeWidth={3.2}
            />
          </div>
          <h3 className="text-[31px] font-bold leading-none text-[#333333]">
            Securely Connected
          </h3>
          <p className="mt-[12px] text-[19px] font-medium text-[#696969]">
            The system is ready to send OTPs through your device.
          </p>
          <button
            type="button"
            onClick={onDisconnect}
            className="mt-[38px] flex h-[65px] items-center gap-[14px] rounded-[5px] bg-[#FFF0F0] px-[35px] text-[18px] font-bold text-[#D00000] transition-colors hover:bg-[#FFE4E4]"
          >
            <LogOut className="size-5" />
            Disconnect Account
          </button>
        </div>
      ) : (
        <div className="flex min-h-[467px] flex-col items-center justify-center px-6 pb-[52px] pt-[55px] text-center">
          <div className="mb-[35px] flex size-[190px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#CACBD4] bg-[#FAFAF8]">
            <div className="grid grid-cols-5 gap-1 opacity-45">
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className="size-5 rounded-sm"
                  style={{
                    background: [
                      0, 1, 5, 6, 7, 10, 12, 14, 17, 18, 19, 20, 24,
                    ].includes(index)
                      ? "#28293D"
                      : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <h3 className="text-[31px] font-bold leading-none text-[#333333]">
            Scan to Connect
          </h3>
          <p className="mt-[12px] text-[19px] font-medium text-[#696969]">
            Point your WhatsApp camera at this QR code.
          </p>
        </div>
      )}
    </section>
  );
};

export default ConnectionPanel;
