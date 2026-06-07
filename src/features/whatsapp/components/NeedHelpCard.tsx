import { HelpCircle } from "lucide-react";
import GatewayCard from "./GatewayCard";

const NeedHelpCard = ({ className }: { className?: string }) => (
  <GatewayCard
    title="Need help?"
    icon={<HelpCircle size={24} className="text-[#28293D]" />}
    className={className}
    contentClassName="flex items-center justify-center px-5 py-6 text-center sm:px-6"
  >
    <a
      href="#"
      className="text-[14px] font-semibold text-[#000000] hover:text-primary"
    >
      Read our knowledge base for gateway troubleshooting
    </a>
  </GatewayCard>
);

export default NeedHelpCard;
