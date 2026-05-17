import { HelpCircle } from "lucide-react";

const NeedHelpPanel = () => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
      <div className="flex h-[55px] items-center justify-between bg-[#F5F0EA] px-[20px]">
        <h2 className="text-[20px] font-bold text-[#333333]">Need help?</h2>
        <HelpCircle className="size-7 text-[#000000]" strokeWidth={1.8} />
      </div>

      <div className="px-[34px] py-[29px] text-center text-[14px] font-bold leading-[1.18] text-[#000000]">
        Read our knowledge base for gateway troubleshooting
      </div>
    </section>
  );
};

export default NeedHelpPanel;
