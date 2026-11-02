import { Pencil, Target, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PricingRule } from "../types";

interface PricingRulesCardProps {
  rules: PricingRule[];
  onEdit?: (rule: PricingRule) => void;
  onDelete?: (rule: PricingRule) => void;
}

const PricingRulesCard = ({
  rules,
  onEdit,
  onDelete,
}: PricingRulesCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="group/card h-full gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-bold text-[#333333] sm:text-[16px]">
          {t("Active Pricing Rules")}
        </h3>
        <Target size={24} className="text-[#28293D] transition-transform duration-200 ease-out group-hover/card:scale-105" />
      </div>
      <CardContent className="flex h-full flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
        {rules.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B] animate-in fade-in-50 duration-200">
            {t("No pricing rules yet.")}
          </p>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-col gap-3 rounded-[12px] bg-[#FAFAF7] border border-[#E5E5E5] px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate text-[14px] font-semibold text-[#333333]">
                  {rule.name}
                </p>
                <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                  {rule.type} • {rule.value}%
                </p>
                <Badge className="h-5 w-fit gap-1 rounded-full border border-[#9524E4]/40 bg-[#F3E9FA] px-2.5 py-0 text-[10px] font-semibold text-[#9524E4]">
                  <span dir="ltr">MIN {rule.minimumQuantity} UNITS</span>
                </Badge>
              </div>
              <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                <button
                  type="button"
                  aria-label={`Edit ${rule.name}`}
                  onClick={() => onEdit?.(rule)}
                  className="group inline-flex size-9 cursor-pointer items-center justify-center rounded-[8px] text-[#000000] hover:bg-white transition-all duration-150 active:scale-90"
                >
                  <Pencil size={18} className="transition-transform duration-150 group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${rule.name}`}
                  onClick={() => onDelete?.(rule)}
                  className="group inline-flex size-9 cursor-pointer items-center justify-center rounded-[8px] text-[#C90000] hover:bg-white transition-all duration-150 active:scale-90"
                >
                  <Trash2 size={18} className="transition-transform duration-150 group-hover:scale-110" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PricingRulesCard;
