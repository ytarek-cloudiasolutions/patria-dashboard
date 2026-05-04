import { useState } from "react";
import { Plus, ShoppingBag, Tag, Heart, TrendingUp } from "lucide-react";

import {
  initialPricingRules,
  initialWholesalePriceLists,
  pricingStats,
} from "./data";
import type { PricingRule, CreatePricingRuleFormData } from "./types";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import DateRangeFilter from "../account/components/DateRangeFilter";
import ActivePricingRulesSection from "./components/ActivePricingRulesSection";
import CreatePricingRuleDialog from "./components/CreatePricingRuleDialog";
import WholesalePriceListsSection from "./components/WholesalePriceListsSection";

const overviewCards = [
  {
    title: "Active Pricing Rules",
    key: "activePricingRules" as const,
    icon: <ShoppingBag size={20} />,
    badgeColor: "bg-[#FFF5EC]",
    iconColor: "text-[#FF8A00]",
  },
  {
    title: "Wholesale Price Lists",
    key: "wholesalePriceLists" as const,
    icon: <Tag size={20} />,
    badgeColor: "bg-[#F3EEFF]",
    iconColor: "text-[#6B3FD4]",
  },
  {
    title: "Average Discount Rate",
    key: "averageDiscountRate" as const,
    icon: <Heart size={20} />,
    badgeColor: "bg-[#FFF0F5]",
    iconColor: "text-[#E0006A]",
  },
  {
    title: "Impact on Revenue",
    key: "impactOnRevenue" as const,
    icon: <TrendingUp size={20} />,
    badgeColor: "bg-[#E2F4ED]",
    iconColor: "text-[#059B5A]",
  },
];

const PricingPage = () => {
  const [rules, setRules] = useState<PricingRule[]>(initialPricingRules);
  const [priceLists] = useState(initialWholesalePriceLists);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Derived stats — keep in sync with actual data
  const liveStats = {
    activePricingRules: rules.length,
    wholesalePriceLists: priceLists.length,
    averageDiscountRate: pricingStats.averageDiscountRate,
    impactOnRevenue: pricingStats.impactOnRevenue,
  };

  const handleCreateRule = (formData: CreatePricingRuleFormData) => {
    const newRule: PricingRule = {
      id: Date.now().toString(),
      name: formData.ruleName,
      type: formData.type,
      adjustmentType: formData.adjustmentType,
      value: parseFloat(formData.value) || 0,
      minimumQuantity: parseInt(formData.minimumQuantity) || 0,
    };
    setRules((prev) => [...prev, newRule]);
  };

  const handleEditRule = (rule: PricingRule) => {
    // TODO: open edit dialog pre-filled with rule data
    console.log("Edit rule:", rule);
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleManagePricelists = () => {
    // TODO: navigate to pricelists management
    console.log("Manage pricelists");
  };

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[#28293D] text-[24px] font-semibold">
            Pricing Strategy
          </h1>
          <p className="text-[#8B8B8B] text-[14px] mt-1">
            Manage bulk discounts, wholesale tiers, and dynamic surcharges.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleManagePricelists}
            className="flex items-center gap-2 h-11 px-5 rounded-[8px] border border-[#E5D5B8] bg-[#FFF8EE] text-[#8B6914] text-[14px] font-semibold hover:bg-[#F5EDDC] transition-colors"
          >
            <ShoppingBag size={16} />
            Manage Pricelists
          </button>
          <DefaultButton
            data={{
              buttonText: "New Pricing Rule",
              icon: <Plus size={16} />,
              onClick: () => setIsDialogOpen(true),
              className:
                "h-11 px-5 bg-[#8B6914] hover:bg-[#7A5C10] text-white text-[14px]",
            }}
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <DateRangeFilter
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {overviewCards.map((card) => (
          <OverviewCard
            key={card.title}
            data={{
              title: card.title,
              value: liveStats[card.key],
              icon: card.icon,
              badgeColor: card.badgeColor,
              iconColor: card.iconColor,
            }}
          />
        ))}
      </div>

      {/* Main Content: two side-by-side panels */}
      <div className="grid grid-cols-2 gap-5">
        <ActivePricingRulesSection
          rules={rules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
        />
        <WholesalePriceListsSection priceLists={priceLists} />
      </div>

      {/* Create Pricing Rule Dialog */}
      <CreatePricingRuleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateRule}
      />
    </div>
  );
};

export default PricingPage;
