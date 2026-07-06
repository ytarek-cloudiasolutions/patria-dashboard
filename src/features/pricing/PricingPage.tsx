import { useEffect, useMemo, useState } from "react";
import { Plus, WalletCards } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import {
  showErrorToast,
  showSuccessToast,
} from "@/shared/utils/toast";

import CreatePricingRuleDialog from "./components/CreatePricingRuleDialog";
import NewPriceListDialog from "./components/NewPriceListDialog";
import PricingDateRange from "./components/PricingDateRange";
import PricingOverview from "./components/PricingOverview";
import PricingRulesCard from "./components/PricingRulesCard";
import WholesalePriceListsCard from "./components/WholesalePriceListsCard";

import {
  createPriceList,
  createPricingRule,
  deletePriceList,
  deletePricingRule,
  fetchPricing,
  type PricingStats,
} from "./api/pricingApi";
import type {
  PricingDateRange as PricingDateRangeType,
  PricingRule,
  PricingRuleFormData,
  PriceListFormData,
  WholesalePriceList,
} from "./types";

const DEFAULT_STATS: PricingStats = {
  activeRulesCount: 0,
  priceListsCount: 0,
  avgDiscountRate: 0,
  monthlyRevenue: 0,
};

const PricingPage = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<PricingDateRangeType>({
    from: "",
    to: "",
  });
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [wholesaleLists, setWholesaleLists] = useState<WholesalePriceList[]>(
    [],
  );
  const [apiStats, setApiStats] = useState<PricingStats>(DEFAULT_STATS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  // Fetch rules + price lists on mount
  useEffect(() => {
    fetchPricing()
      .then(({ rules: r, priceLists, stats }) => {
        setRules(r);
        setWholesaleLists(priceLists);
        setApiStats(stats);
      })
      .catch(() => {
        // Non-blocking — keep empty lists if fetch fails
      });
  }, []);

  const averageDiscountRate = useMemo(() => {
    if (apiStats.avgDiscountRate > 0) return apiStats.avgDiscountRate;
    if (rules.length === 0) return 0;
    const discounts = rules.map((r) => Math.abs(r.value)).filter((v) => v > 0);
    if (discounts.length === 0) return 0;
    return discounts.reduce((sum, v) => sum + v, 0) / discounts.length;
  }, [rules, apiStats.avgDiscountRate]);

  const handleCreateRule = async (data: PricingRuleFormData) => {
    try {
      const newRule = await createPricingRule(data);
      setRules((prev) => [newRule, ...prev]);
      showSuccessToast(t("Pricing rule created"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to create pricing rule");
      showErrorToast(msg);
    }
  };

  const handleDeleteRule = async (rule: PricingRule) => {
    // Optimistic removal
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
    try {
      await deletePricingRule(String(rule.id));
      showSuccessToast(t("Pricing rule deleted"));
    } catch (err: unknown) {
      // Revert on failure
      setRules((prev) => [rule, ...prev]);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to delete pricing rule");
      showErrorToast(msg);
    }
  };

  const handleCreateList = async (data: PriceListFormData) => {
    try {
      const newList = await createPriceList(data);
      setWholesaleLists((prev) => [newList, ...prev]);
      showSuccessToast(t("Price list created"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to create price list");
      showErrorToast(msg);
    }
  };

  const handleDeleteList = async (list: WholesalePriceList) => {
    // Optimistic removal
    setWholesaleLists((prev) => prev.filter((l) => l.id !== list.id));
    try {
      await deletePriceList(String(list.id));
      showSuccessToast(t("Price list deleted"));
    } catch (err: unknown) {
      // Revert on failure
      setWholesaleLists((prev) => [list, ...prev]);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to delete price list");
      showErrorToast(msg);
    }
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
              onClick: () => setIsPriceListOpen(true),
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
        <WholesalePriceListsCard
          lists={wholesaleLists}
          onDelete={handleDeleteList}
        />
      </div>

      <CreatePricingRuleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleCreateRule}
      />

      <NewPriceListDialog
        open={isPriceListOpen}
        onOpenChange={setIsPriceListOpen}
        onSave={handleCreateList}
      />
    </>
  );
};

export default PricingPage;
