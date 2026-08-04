import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Plus,
  AlertTriangle,
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { InventoryCountSession } from "../types";

interface InventoryDetailViewProps {
  session: InventoryCountSession;
  onBack: () => void;
}

interface InventoryDetailItem {
  id: string;
  product: string;
  difference: number;
  systemBalance: number;
  countableQuantity: number;
}

const INITIAL_ITEMS: InventoryDetailItem[] = [
  {
    id: "1",
    product: "Kunafa Tiramsu",
    difference: 0,
    systemBalance: 0,
    countableQuantity: 0,
  },
  {
    id: "2",
    product: "Tomatoes",
    difference: 0,
    systemBalance: 0,
    countableQuantity: 0,
  },
  {
    id: "3",
    product: "Amber Sobila",
    difference: 7,
    systemBalance: 0,
    countableQuantity: 7,
  },
];

const InventoryDetailView = ({ session, onBack }: InventoryDetailViewProps) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryDetailItem[]>(INITIAL_ITEMS);

  const handleQuantityChange = (id: string, val: string) => {
    const qty = Number(val) || 0;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            countableQuantity: qty,
            difference: qty - item.systemBalance,
          };
        }
        return item;
      })
    );
  };

  const identicalCount = items.filter((i) => i.difference === 0).length;
  const extraCount = items.filter((i) => i.difference > 0).length;
  const outOfStockCount = items.filter((i) => i.countableQuantity === 0).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Back Header Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full bg-white border border-[#E5E5E5] text-black hover:bg-[#F5F0EA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-5 text-black" />
        </button>

        <h2 className="text-[16px] font-bold text-black">
          {session.number} - {session.warehouse}
        </h2>

        <Badge
          className={`h-7 px-3 rounded-[30px] text-[13px] font-semibold tracking-[0.26px] shadow-none ${
            session.status === "In Progress"
              ? "bg-[#EDF4FB] text-[#3574FF] border border-[#004EF9]"
              : "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]"
          }`}
        >
          {t(session.status)}
        </Badge>
      </div>

      {/* Analytical Inventory Summary Section */}
      <div className="flex flex-col rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="bg-[#F5F0EA] px-[26px] py-3 border-b border-[#E5E5E5]">
          <h3 className="text-[16px] font-bold text-[#333333]">
            {t("Analytical Inventory")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
          {/* Card 1: identical */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("identical")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                {identicalCount === 3 ? session.noOfItems : identicalCount}
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
              <MapPin size={24} className="text-[#059B5A]" />
            </div>
          </div>

          {/* Card 2: Extra */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("Extra")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                {extraCount}
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#FE9A00]/10">
              <Plus size={24} className="text-[#C7861E]" />
            </div>
          </div>

          {/* Card 3: Out of Stock */}
          <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                {t("Out of Stock")}
              </span>
              <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                {outOfStockCount}
              </span>
            </div>
            <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Inventory Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-none">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PRODUCT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SYSTEM BALANCE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("THE COUNTABLE QUANTITY")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("DIFFERENCE")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-none hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[14px] font-semibold tracking-[0.28px] text-[#333333]">
                  {item.product}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-bold tracking-[0.28px] text-black">
                  {item.systemBalance}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center w-48">
                    <input
                      type="number"
                      value={item.countableQuantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="h-[36px] w-full rounded-full border border-[#E5E5E5] bg-white px-4 text-center text-[14px] font-medium text-[#28293D] focus:border-[#8F6900] focus:outline-none"
                    />
                  </div>
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center text-[14px] font-bold tracking-[0.28px] text-black">
                  {item.difference}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryDetailView;
