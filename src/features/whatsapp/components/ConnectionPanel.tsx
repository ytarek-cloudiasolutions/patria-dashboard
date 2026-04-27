import { LogOut, ShieldCheck, Zap } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import type { ConnectionStatus } from "../types";

interface ConnectionPanelProps {
  status: ConnectionStatus;
  onDisconnect: () => void;
}

const ConnectionPanel = ({ status, onDisconnect }: ConnectionPanelProps) => {
  const isConnected = status === "Connected";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#28293D]">
                Connections
              </span>
              <Zap size={18} className="text-[#6B6B6B]" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="px-5 py-0">
            {isConnected ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-6 flex h-[130px] w-[130px] items-center justify-center rounded-[28px] bg-[#E0F5EC]">
                  <ShieldCheck
                    size={56}
                    className="text-[#059B5A]"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mb-1.5 text-[22px] font-bold text-[#28293D]">
                  Securely Connected
                </p>
                <p className="mb-8 text-[14px] text-[#6B6B6B]">
                  The system is ready to send OTPs through your device.
                </p>
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 rounded-[10px] border border-[#F5A8A8] bg-[#FFF0F0] px-6 py-3 text-[14px] font-semibold text-[#C90000] transition hover:bg-[#FFE0E0] cursor-pointer"
                >
                  <LogOut size={16} />
                  Disconnect Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-6 flex h-[180px] w-[180px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#E5E5E5] bg-[#FAFAF8]">
                  <div className="grid grid-cols-5 gap-1 opacity-40">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-5 rounded-sm"
                        style={{
                          background: [
                            0, 1, 5, 6, 7, 10, 12, 14, 17, 18, 19, 20, 24,
                          ].includes(i)
                            ? "#28293D"
                            : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="mb-1.5 text-[16px] font-bold text-[#28293D]">
                  Scan to Connect
                </p>
                <p className="text-[13px] text-[#6B6B6B]">
                  Point your WhatsApp camera at this QR code.
                </p>
              </div>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ConnectionPanel;
