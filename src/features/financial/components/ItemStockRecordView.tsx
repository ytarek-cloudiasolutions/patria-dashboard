import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface StockRecordRow {
  id: string;
  note: string;
  reference: string;
  importQty: string;
  transactionType: string;
  exportQty: string;
  balance: string;
  date: string;
}

const MOCK_RECORDS: StockRecordRow[] = [
  {
    id: "1",
    note: "#ORD-214067",
    reference: "ORD-544332",
    importQty: "+1",
    transactionType: "Sales",
    exportQty: "-1",
    balance: "-1",
    date: "4/14/2026",
  },
  {
    id: "2",
    note: "#ORD-214067",
    reference: "ORD-544333",
    importQty: "+1",
    transactionType: "Sales",
    exportQty: "-1",
    balance: "-2",
    date: "4/14/2026",
  },
  {
    id: "3",
    note: "#ORD-214067",
    reference: "ORD-544334",
    importQty: "-",
    transactionType: "Sales",
    exportQty: "-1",
    balance: "-3",
    date: "4/14/2026",
  },
  {
    id: "4",
    note: "#ORD-214067",
    reference: "ORD-544332",
    importQty: "-",
    transactionType: "Sales",
    exportQty: "-1",
    balance: "-4",
    date: "4/14/2026",
  },
  {
    id: "5",
    note: "#ORD-214067",
    reference: "ORD-544335",
    importQty: "-",
    transactionType: "Sales",
    exportQty: "-1",
    balance: "-5",
    date: "4/14/2026",
  },
];

const CATEGORY_OPTIONS = [
  { value: "Bakery", label: "Bakery" },
  { value: "Drinks", label: "Drinks" },
  { value: "General", label: "General" },
  { value: "Sandwiches", label: "Sandwiches" },
];

const ItemStockRecordView = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState("2026-04-14");
  const [toDate, setToDate] = useState("2026-04-14");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLoadStockCard = () => {
    // Action to load stock card
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full min-w-[200px]">
          {isDropdownOpen && (
            <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
          )}
          <DropdownSelect
            options={CATEGORY_OPTIONS.map((c) => ({
              ...c,
              label: t(c.label),
            }))}
            selected={category}
            onSelect={setCategory}
            onOpenChange={setIsDropdownOpen}
            placeholder={t("--- Select the category ---")}
            align="start"
            className="w-full md:!w-full h-14"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* From Date */}
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder={t("From")}
            popoverPlacement="bottom-right"
            withBackdrop
            className="flex-1 sm:w-[186.5px]"
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
            className="flex-1 sm:w-[186.5px]"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />
        </div>

        <button
          type="button"
          onClick={handleLoadStockCard}
          className="h-14 w-full lg:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer"
        >
          {t("Load Stock Card")}
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Imports */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Imports")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              20 Pcs
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
            <TrendingUp size={24} className="text-[#059B5A]" />
          </div>
        </div>

        {/* Card 2: Total Exports */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Exports")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              106 Pcs
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <TrendingDown size={24} className="text-white" />
          </div>
        </div>

        {/* Card 3: Current balance */}
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Current balance")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              0 Pcs
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E5E5E5]">
            <Package size={24} className="text-[#595959]" />
          </div>
        </div>
      </div>

      {/* Stock Card Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h3 className="text-[18px] font-bold text-[#333333] tracking-[0.36px]">
            {t("Item Card — Almond Croissant")}
          </h3>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("NOTE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("BALANCE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("EXPORT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("IMPORT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("REFERENCE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("TRANSACTION TYPE")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("DATE")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_RECORDS.map((row) => (
              <TableRow key={row.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                  {row.note}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-black">
                  {row.balance}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                  {row.exportQty}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#059B5A]">
                  {row.importQty}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]">
                  {row.reference}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    <Badge className="h-6 px-3 rounded-[30px] bg-[#DCDCDC] text-[#23252A] border border-[#595959] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                      {t(row.transactionType)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black" dir="ltr">
                  {row.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ItemStockRecordView;
