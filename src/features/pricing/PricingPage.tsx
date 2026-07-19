import { useEffect, useState } from "react";
import { Plus, WalletCards, Tag } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import DeleteDialog from "@/shared/components/DeleteDialog";

import CreatePricingRuleDialog from "./components/CreatePricingRuleDialog";
import NewPriceListDialog from "./components/NewPriceListDialog";
import PricingDateRange from "./components/PricingDateRange";
import PricingOverview from "./components/PricingOverview";
import PricingRulesCard from "./components/PricingRulesCard";
import WholesalePriceListsCard from "./components/WholesalePriceListsCard";

import {
  fetchPricing,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  createPriceList,
  updatePriceList,
  deletePriceList,
  type PricingStats,
} from "./api/pricingApi";
import type {
  PriceListFormData,
  PricingDateRange as PricingDateRangeType,
  PricingRule,
  PricingRuleFormData,
  WholesalePriceList,
} from "./types";

const PricingPage = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<PricingDateRangeType>({
    from: "",
    to: "",
  });
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [wholesaleLists, setWholesaleLists] = useState<WholesalePriceList[]>([]);
  const [stats, setStats] = useState<PricingStats>({
    activeRulesCount: 0,
    priceListsCount: 0,
    avgDiscountRate: 0,
    monthlyRevenue: 0,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [editingList, setEditingList] = useState<WholesalePriceList | null>(null);

  const [ruleToDelete, setRuleToDelete] = useState<PricingRule | null>(null);
  const [listToDelete, setListToDelete] = useState<WholesalePriceList | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadPricingData = () => {
    fetchPricing()
      .then((res) => {
        setRules(res.rules);
        setWholesaleLists(res.priceLists);
        setStats(res.stats);
      })
      .catch(() => {})
      .finally(() => {
        setHasLoaded(true);
      });
  };

  useEffect(() => {
    loadPricingData();
  }, []);

  const handleSaveRule = (data: PricingRuleFormData) => {
    if (editingRule) {
      updatePricingRule(editingRule.id, data).then(() => {
        loadPricingData();
        setEditingRule(null);
      });
    } else {
      createPricingRule(data).then(() => {
        loadPricingData();
      });
    }
  };

  const handleSaveList = (data: PriceListFormData) => {
    if (editingList) {
      updatePriceList(editingList.id, data).then(() => {
        loadPricingData();
        setEditingList(null);
      });
    } else {
      createPriceList(data).then(() => {
        loadPricingData();
      });
    }
  };

  const handleConfirmDeleteRule = () => {
    if (ruleToDelete) {
      deletePricingRule(String(ruleToDelete.id)).then(() => {
        loadPricingData();
        setRuleToDelete(null);
      });
    }
  };

  const handleConfirmDeleteList = () => {
    if (listToDelete) {
      deletePriceList(String(listToDelete.id)).then(() => {
        loadPricingData();
        setListToDelete(null);
      });
    }
  };

  if (!hasLoaded) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Tag className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
                "border-transparent bg-[#F5F0EA] text-primary hover:bg-[#F5F0EA]",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("New Pricing Rule"),
              icon: <Plus className="size-4.5" />,
              onClick: () => {
                setEditingRule(null);
                setIsCreateOpen(true);
              },
            }}
          />
        </div>
      </div>

      <PricingDateRange value={dateRange} onChange={setDateRange} />

      <PricingOverview
        activeRules={stats.activeRulesCount}
        wholesaleLists={stats.priceListsCount}
        averageDiscountRate={stats.avgDiscountRate}
        revenueImpact={`EGP ${stats.monthlyRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PricingRulesCard
          rules={rules}
          onEdit={(rule) => {
            setEditingRule(rule);
            setIsCreateOpen(true);
          }}
          onDelete={setRuleToDelete}
        />
        <WholesalePriceListsCard
          lists={wholesaleLists}
          onEdit={(list) => {
            setEditingList(list);
            setIsPriceListOpen(true);
          }}
          onDelete={setListToDelete}
        />
      </div>

      <CreatePricingRuleDialog
        open={isCreateOpen}
        rule={editingRule}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setEditingRule(null);
        }}
        onSave={handleSaveRule}
      />

      <NewPriceListDialog
        open={isPriceListOpen}
        list={editingList}
        onOpenChange={(open) => {
          setIsPriceListOpen(open);
          if (!open) setEditingList(null);
        }}
        onSave={handleSaveList}
      />

      <DeleteDialog
        open={ruleToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRuleToDelete(null);
        }}
        data={{
          item: ruleToDelete?.name ?? "",
          type: "pricing rule",
        }}
        onConfirm={handleConfirmDeleteRule}
      />

      <DeleteDialog
        open={listToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setListToDelete(null);
        }}
        data={{
          item: listToDelete?.name ?? "",
          type: "price list",
        }}
        onConfirm={handleConfirmDeleteList}
      />
    </>
  );
};

export default PricingPage;
