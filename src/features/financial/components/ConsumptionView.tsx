import { useState } from "react";
import { Package, Wallet, TrendingUp, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface ConsumptionRow {
  id: string;
  item: string;
  sales: string;
  waste: string;
  production: string;
  total: string;
  cost: string;
  income: string;
  profit: string;
}

const CONSUMPTION_DATA_ROWS: ConsumptionRow[] = [
  {
    id: "1",
    item: "Almond Croissant",
    sales: "10",
    waste: "2",
    production: "0",
    total: "8",
    cost: "EGP 140.00",
    income: "EGP 500.75",
    profit: "EGP 0.00",
  },
  {
    id: "2",
    item: "Middle Eastern Roast Beef",
    sales: "5",
    waste: "0",
    production: "0",
    total: "5",
    cost: "EGP 0.00",
    income: "EGP 100.00",
    profit: "EGP 0.00",
  },
  {
    id: "3",
    item: "Layaly Lebnan - M",
    sales: "1",
    waste: "0",
    production: "0",
    total: "1",
    cost: "EGP 0.00",
    income: "EGP 1000.00",
    profit: "EGP 500.75",
  },
  {
    id: "4",
    item: "Kunafa Tiramisu - M",
    sales: "1",
    waste: "0",
    production: "0",
    total: "1",
    cost: "EGP 0.00",
    income: "EGP 0.00",
    profit: "EGP 500.75",
  },
  {
    id: "5",
    item: "Banoffy Kunafa - L",
    sales: "1",
    waste: "0",
    production: "0",
    total: "1",
    cost: "EGP 0.00",
    income: "EGP 250.50",
    profit: "EGP 500.75",
  },
];

const ConsumptionView = () => {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState("2026-04-14");
  const [toDate, setToDate] = useState("2026-04-14");

  const handleGenerateReport = () => {
    // Report generation action
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Pickers & Action Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full lg:w-auto flex-1">
          {/* From Date */}
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder={t("From")}
            popoverPlacement="bottom-right"
            withBackdrop
            className="flex-1"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />

          {/* To Date */}
          <DatePicker
            value={toDate}
            onChange={setToDate}
            placeholder={t("To")}
            popoverPlacement="bottom-right"
            minDate={fromDate || undefined}
            withBackdrop
            className="flex-1"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateReport}
          className="h-14 w-full lg:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer"
        >
          {t("Generate Report")}
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Consumed */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Consumed")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              22
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
            <Package size={24} className="text-[#8F6900]" />
          </div>
        </div>

        {/* Card 2: Consumption cost */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Consumption cost")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              EGP 23.6
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[rgba(254,154,0,0.10)]">
            <Wallet size={24} className="text-[#C7861E]" />
          </div>
        </div>

        {/* Card 3: Sales revenue */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Sales revenue")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              EGP 3,337
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
            <TrendingUp size={24} className="text-[#059B5A]" />
          </div>
        </div>

        {/* Card 4: Total loss */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total loss")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              0
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <Trash2 size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Consumption Breakdown Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ITEM")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SALES")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("WASTE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PRODUCTION")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("TOTAL")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("COST")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("INCOME")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PROFIT")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONSUMPTION_DATA_ROWS.map((row) => (
              <TableRow key={row.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                  {row.item}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.sales}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                  {row.waste}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.production}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-bold tracking-[0.28px] text-black">
                  {row.total}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]" dir="ltr">
                  {row.cost}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#059B5A]" dir="ltr">
                  {row.income}
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#059B5A]" dir="ltr">
                  {row.profit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConsumptionView;
