import { ShieldCheck } from "lucide-react";
import type { GatewaySecurity } from "../types";

interface GatewaySecurityPanelProps {
  data: GatewaySecurity;
}

const GatewaySecurityPanel = ({ data }: GatewaySecurityPanelProps) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
      <div className="flex h-[55px] items-center justify-between bg-[#F5F0EA] px-[20px]">
        <h2 className="text-[20px] font-bold text-[#333333]">
          Gateway Security
        </h2>
        <ShieldCheck className="size-7 text-[#000000]" strokeWidth={1.8} />
      </div>

      <div className="px-[18px] pb-[24px] pt-[29px]">
        <div className="rounded-[10px] bg-[#E4E4E4] px-[14px] py-[17px]">
          <h3 className="text-[15px] font-bold text-[#000000]">
            {data.title}
          </h3>
          <p className="mt-[8px] text-[13px] font-medium leading-[1.18] text-[#28293D]">
            {data.description}
          </p>
        </div>

        <p className="mt-[13px] text-center text-[12px] font-bold leading-[1.25] text-[#000000]">
          {data.complianceNote}
        </p>
        <p className="mt-[4px] text-center text-[12px] font-bold leading-none text-[#000000]">
          Last audit: {data.lastAudit}
        </p>
      </div>
    </section>
  );
};

export default GatewaySecurityPanel;
