import { useEffect, useState } from "react";
import { TrendingUp, Package, BarChart2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { formatEgp } from "@/features/pos/utils";

interface CategoryValueItem {
  category: string;
  value: number;
  itemCount: number;
}

interface CostAnalysisItem {
  productId: string;
  name: string;
  cost: number;
  sellingPrice: number;
  balance: number;
  inventoryValue: number;
  profitMargin: number;
}

const marginColor = (margin: number) => {
  if (margin >= 50) return "text-[#059B5A]";
  if (margin > 0) return "text-[#C7861E]";
  return "text-[#C90000]";
};

const CostAnalysisView = () => {
  const { t } = useTranslation();
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfCategories, setNumberOfCategories] = useState(0);
  const [valueByCategory, setValueByCategory] = useState<CategoryValueItem[]>([]);
  const [items, setItems] = useState<CostAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/inventory/cost-analysis")
      .then((response) => {
        if (cancelled) return;
        const data = response.data ?? {};
        setTotalInventoryValue(data.totalInventoryValue ?? 0);
        setNumberOfItems(data.numberOfItems ?? 0);
        setNumberOfCategories(data.numberOfCategories ?? 0);
        setValueByCategory(data.valueByCategory ?? []);
        setItems(data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setValueByCategory([]);
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const maxCategoryValue = Math.max(1, ...valueByCategory.map((c) => c.value));

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#8F6900]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 3 Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total inventory value")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {formatEgp(totalInventoryValue)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
            <TrendingUp size={24} className="text-[#8F6900]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Number of items")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {numberOfItems}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#DBEAFE]">
            <Package size={24} className="text-[#155DFC]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Number of categories")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {numberOfCategories}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#FE9A00]/10">
            <BarChart2 size={24} className="text-[#C7861E]" />
          </div>
        </div>
      </div>

      {/* Value by Category Card */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="bg-[#F5F0EA] px-6 py-3 border-b border-[#E5E5E5]">
          <h3 className="text-[18px] font-semibold leading-6 text-[#333333]">
            {t("Value by category")}
          </h3>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {valueByCategory.length === 0 ? (
            <p className="text-center text-[14px] text-[#8B8B8B]">{t("No data yet")}</p>
          ) : (
            valueByCategory.map((cat) => (
              <div key={cat.category} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold tracking-[0.28px] text-black">
                    {t(cat.category)}
                  </span>
                  <span className="text-[12px] font-semibold tracking-[0.24px] text-black" dir="ltr">
                    {formatEgp(cat.value)} ({cat.itemCount} {t("items")})
                  </span>
                </div>
                <div className="h-[17px] w-full overflow-hidden rounded-[6px] border border-[#E5E5E5] bg-[#E5E5E5]">
                  <div
                    className="h-full rounded-s-[6px] bg-[#8F6900] transition-all duration-300"
                    style={{ width: `${Math.max(2, (cat.value / maxCategoryValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cost Analysis Breakdown Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ITEM")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("COST")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SELLING PRICE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("BALANCE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("INVENTORY VALUE")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PROFIT MARGIN")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={6} className="py-10 text-center text-[14px] text-[#8B8B8B]">
                  {t("No products found")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.productId} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                  <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                    {row.name}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                    {formatEgp(row.cost)}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                    {formatEgp(row.sellingPrice)}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                    {row.balance}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                    {formatEgp(row.inventoryValue)}
                  </TableCell>
                  <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                    <span className={`text-[14px] font-semibold tracking-[0.28px] ${marginColor(row.profitMargin)}`}>
                      {row.profitMargin.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CostAnalysisView;
