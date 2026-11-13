import { Info } from "lucide-react";

type PosGuidanceCardProps = {
  title: string;
  description: string;
};

const PosGuidanceCard = ({ title, description }: PosGuidanceCardProps) => (
  <div
    role="status"
    className="mb-3 rounded-lg border border-[#8F6900] bg-white p-3 text-[#725400] shadow-sm"
  >
    <div className="flex items-start gap-2.5">
      <Info className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="text-[12px] font-semibold">{title}</p>
        <p className="mt-1 text-[11px] leading-4">{description}</p>
      </div>
    </div>
  </div>
);

export default PosGuidanceCard;
