import { useState } from "react";
import { Package, DollarSign, AlertTriangle } from "lucide-react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";

interface ItemBalanceRow {
  id: string;
  warehouse: string;
  type: "MAIN WAREHOUSE" | "Sub WAREHOUSE";
  quantity: number;
  value: number;
  status: "Low" | "Stable";
}

const MOCK_ROWS: ItemBalanceRow[] = [
  {
    id: "1",
    warehouse: "Main Kitchen",
    type: "MAIN WAREHOUSE",
    quantity: 5,
    value: 280.0,
    status: "Low",
  },
  {
    id: "2",
    warehouse: "Front Counter",
    type: "Sub WAREHOUSE",
    quantity: 1,
    value: 280.0,
    status: "Stable",
  },
];

const CATEGORY_OPTIONS = [
  { value: "Testing Coffee", label: "Testing Coffee" },
  { value: "Bakery", label: "Bakery" },
  { value: "General", label: "General" },
  { value: "Desserts", label: "Desserts" },
];

const ItemBalanceView = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInquire = () => {
    // Inquire action
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Category Select + Inquire Button Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full">
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

        <button
          type="button"
          onClick={handleInquire}
          className="h-14 w-full sm:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer"
        >
          {t("Inquire")}
        </button>
      </div>

      {/* Item Title & Summary Cards Section */}
      <div className="flex flex-col rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        {/* Header Title */}
        <div className="bg-[#F5F0EA] px-[26px] py-3 border-b border-[#E5E5E5]">
          <h3 className="text-[16px] font-bold text-[#333333]">
            {t("Almond Croissant")}
          </h3>
          <p className="text-[14px] font-medium tracking-[0.28px] text-[#8B8B8B]">
            {t("Barcode: — | Unit: pcs | Category: Testing Coffee")}
          </p>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
          {/* Card 1: Total Quantity */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("Total Quantity")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                6
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
              <Package size={24} className="text-[#8F6900]" />
            </div>
          </div>

          {/* Card 2: Total Value */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("Total Value")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                EGP 3,337
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
              <DollarSign size={24} className="text-[#059B5A]" />
            </div>
          </div>

          {/* Card 3: Status */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("Status")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                {t("Low")}
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Breakdown Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-none">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("WAREHOUSE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("TYPE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("QUANTITY")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("VALUE")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("STATUS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ROWS.map((row) => (
              <TableRow key={row.id} className="border-none hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.warehouse}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    {row.type === "MAIN WAREHOUSE" ? (
                      <Badge className="h-7 px-4 rounded-[30px] bg-[#8F6900] text-white border border-[#725400] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("MAIN WAREHOUSE")}
                      </Badge>
                    ) : (
                      <Badge className="h-7 px-4 rounded-[30px] bg-[#F5F0EA] text-[#8F6900] border border-[#8F6900] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Sub WAREHOUSE")}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.quantity}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#333333]" dir="ltr">
                  EGP {row.value.toFixed(2)}
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    {row.status === "Low" ? (
                      <Badge className="h-7 px-4 rounded-[30px] bg-[#C90000] text-white border border-[#C90000] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Low")}
                      </Badge>
                    ) : (
                      <Badge className="h-7 px-4 rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Stable")}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ItemBalanceView;
