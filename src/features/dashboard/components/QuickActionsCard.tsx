import type { QuickActionItemProps } from "../types";

interface QuickActionsCardProps {
  actions: QuickActionItemProps[];
}

const QuickActionsCard = ({ actions }: QuickActionsCardProps) => {
  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-1.5 px-2 py-3 font-medium text-[12px] border border-[#CACBD4] rounded-[8px] text-[#28293D]"
          >
            <img
              src={action.icon}
              alt={action.icon}
              className="w-4 h-[15.36px]"
            />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      <div />
    </div>
  );
};

export default QuickActionsCard;
