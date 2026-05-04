import { Target } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { ActivePricingRulesSectionProps } from "../types";
import PricingRuleCard from "./PricingRuleCard";

const ActivePricingRulesSection = ({
  rules,
  onEdit,
  onDelete,
}: ActivePricingRulesSectionProps) => {
  return (
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] shadow-sm flex-1">
      <CardContent className="px-5 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#28293D] text-[15px] font-semibold">
            Active Pricing Rules
          </h2>
          <span className="text-[#8B8B8B]">
            <Target size={18} />
          </span>
        </div>

        {/* Rules list */}
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[#8B8B8B] text-[13px]">
            No active pricing rules.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <PricingRuleCard
                key={rule.id}
                rule={rule}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivePricingRulesSection;
