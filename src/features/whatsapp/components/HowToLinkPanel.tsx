import { Smartphone } from "lucide-react";
import type { HowToLinkStep } from "../types";

interface HowToLinkPanelProps {
  steps: HowToLinkStep[];
}

const HowToLinkPanel = ({ steps }: HowToLinkPanelProps) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
      <div className="flex h-[55px] items-center justify-between bg-[#F5F0EA] px-[20px]">
        <h2 className="text-[20px] font-bold text-[#333333]">How to link?</h2>
        <Smartphone className="size-7 text-[#000000]" strokeWidth={1.8} />
      </div>

      <div className="px-[15px] py-[24px]">
        <div className="flex flex-col gap-[18px]">
          {steps.map(({ step, description }) => (
            <div key={step} className="flex items-center gap-[10px]">
              <span className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white">
                {step}
              </span>
              <p className="text-[13px] font-bold leading-snug text-[#000000]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToLinkPanel;
