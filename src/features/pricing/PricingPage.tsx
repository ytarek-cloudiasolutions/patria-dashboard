import { useMemo, useState } from "react";
import { Plus, WalletCards } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";

import CreatePricingRuleDialog from "./components/CreatePricingRuleDialog";
import PricingDateRange from "./components/PricingDateRange";
import PricingOverview from "./components/PricingOverview";
import PricingRulesCard from "./components/PricingRulesCard";
import WholesalePriceListsCard from "./components/WholesalePriceListsCard";

import { INITIAL_PRICING_RULES, INITIAL_WHOLESALE_LISTS } from "./data";
import type {
  AdjustmentType,
  PricingDateRange as PricingDateRangeType,
  PricingRule,
  PricingRuleFormData,
  PricingRuleType,
} from "./types";

const PricingPage = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<PricingDateRangeType>({
    from: "",
    to: "",
  });
  const [rules, setRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [wholesaleLists] = useState(INITIAL_WHOLESALE_LISTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const averageDiscountRate = useMemo(() => {
    if (rules.length === 0) return 12.4;
    const discounts = rules.map((r) => Math.abs(r.value)).filter((v) => v > 0);
    if (discounts.length === 0) return 12.4;
    return discounts.reduce((sum, v) => sum + v, 0) / discounts.length;
  }, [rules]);

  const handleCreateRule = (data: PricingRuleFormData) => {
    const newRule: PricingRule = {
      id: Date.now(),
      name: data.name.trim(),
      type: data.type as PricingRuleType,
      adjustmentType: data.adjustmentType as AdjustmentType,
      value: Number(data.value) || 0,
      minimumQuantity: Number(data.minimumQuantity) || 0,
    };
    setRules((prev) => [newRule, ...prev]);
  };

  const handleDeleteRule = (rule: PricingRule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Pricing Strategy")}
          description={t("Manage bulk discounts, wholesale tiers, and dynamic surcharges.")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <DefaultButton
            data={{
              buttonText: t("Manage Pricelists"),
              variant: "outline",
              icon: <WalletCards className="size-4.5" />,
              className:
                "border-transparent bg-[#F5F0EA] text-primary hover:bg-[#EFE7DA] hover:text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("New Pricing Rule"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsCreateOpen(true),
            }}
          />
        </div>
      </div>

      <PricingDateRange value={dateRange} onChange={setDateRange} />

      <PricingOverview
        activeRules={rules.length}
        wholesaleLists={wholesaleLists.length}
        averageDiscountRate={averageDiscountRate}
        revenueImpact="Monthly +18%"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PricingRulesCard rules={rules} onDelete={handleDeleteRule} />
        <WholesalePriceListsCard lists={wholesaleLists} />
      </div>

      <CreatePricingRuleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleCreateRule}
      />
    </>
  );
};

export default PricingPage;
