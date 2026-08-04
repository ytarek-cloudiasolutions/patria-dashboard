import { TrendingUp, Package, BarChart2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface CategoryValueItem {
  id: string;
  name: string;
  valueText: string;
  percentage: number;
}

const CATEGORIES_DATA: CategoryValueItem[] = [
  { id: "1", name: "Bakery", valueText: "EGP 1000 (110 items)", percentage: 55 },
  { id: "2", name: "General", valueText: "EGP 1,500 (50 items)", percentage: 75 },
  { id: "3", name: "Desserts", valueText: "EGP 3,200 (75 items)", percentage: 20 },
  { id: "4", name: "Drinks", valueText: "EGP 0 (110 items)", percentage: 15 },
  { id: "5", name: "Sandwiches", valueText: "EGP 5,800 (30 items)", percentage: 12 },
];

interface CostAnalysisRow {
  id: string;
  item: string;
  cost: string;
  sellingPrice: string;
  balance: string;
  inventoryValue: string;
  profitMargin: string;
  profitMarginColor: "green" | "red" | "warning";
}

const COST_ROWS: CostAnalysisRow[] = [
  {
    id: "1",
    item: "Almond Croissant",
    cost: "EGP 280.00",
    sellingPrice: "EGP 280.00",
    balance: "0",
    inventoryValue: "EGP 0.00",
    profitMargin: "100.00%",
    profitMarginColor: "green",
  },
  {
    id: "2",
    item: "Middle Eastern Roast Beef",
    cost: "EGP 280.00",
    sellingPrice: "EGP 280.00",
    balance: "0",
    inventoryValue: "EGP 0.00",
    profitMargin: "100.00%",
    profitMarginColor: "green",
  },
  {
    id: "3",
    item: "Layaly Lebnan - M",
    cost: "EGP 280.00",
    sellingPrice: "EGP 280.00",
    balance: "0",
    inventoryValue: "EGP 0.00",
    profitMargin: "100.00%",
    profitMarginColor: "green",
  },
  {
    id: "4",
    item: "Kunafa Tiramisu - M",
    cost: "EGP 280.00",
    sellingPrice: "EGP 280.00",
    balance: "0",
    inventoryValue: "EGP 0.00",
    profitMargin: "0.00%",
    profitMarginColor: "red",
  },
  {
    id: "5",
    item: "Banoffy Kunafa - L",
    cost: "EGP 280.00",
    sellingPrice: "EGP 280.00",
    balance: "0",
    inventoryValue: "EGP 0.00",
    profitMargin: "70.00%",
    profitMarginColor: "warning",
  },
];

const CostAnalysisView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {/* 3 Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total inventory value */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total inventory value")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              EGP 3,337
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
            <TrendingUp size={24} className="text-[#8F6900]" />
          </div>
        </div>

        {/* Card 2: Number of items */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Number of items")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              930
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#DBEAFE]">
            <Package size={24} className="text-[#155DFC]" />
          </div>
        </div>

        {/* Card 3: Number of categories */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Number of categories")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              18
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
          {CATEGORIES_DATA.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold tracking-[0.28px] text-black">
                  {t(cat.name)}
                </span>
                <span className="text-[12px] font-semibold tracking-[0.24px] text-black" dir="ltr">
                  {cat.valueText}
                </span>
              </div>
              <div className="h-[17px] w-full overflow-hidden rounded-[6px] border border-[#E5E5E5] bg-[#E5E5E5]">
                <div
                  className={`h-full bg-[#8F6900] transition-all duration-300 ${
                    cat.percentage >= 100
                      ? "rounded-[6px]"
                      : "rounded-s-[6px] rounded-r-none"
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
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
            {COST_ROWS.map((row) => (
              <TableRow key={row.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                  {row.item}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                  {row.cost}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                  {row.sellingPrice}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.balance}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]" dir="ltr">
                  {row.inventoryValue}
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                  <span
                    className={`text-[14px] font-semibold tracking-[0.28px] ${
                      row.profitMarginColor === "green"
                        ? "text-[#059B5A]"
                        : row.profitMarginColor === "red"
                        ? "text-[#C90000]"
                        : "text-[#C7861E]"
                    }`}
                  >
                    {row.profitMargin}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CostAnalysisView;
