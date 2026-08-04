import { AlertTriangle } from "lucide-react";
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

interface ReorderRow {
  id: string;
  item: string;
  supplier: string;
  shortage: number;
  status: "Sufficient stock" | "Out of Stock" | "Low";
  orderLimit: string;
  currentInventory: string | number;
  inventoryColor?: "green" | "red" | "warning";
}

const REORDER_ROWS: ReorderRow[] = [
  {
    id: "1",
    item: "Almond Croissant",
    supplier: "Patria Pastry",
    shortage: 10,
    status: "Out of Stock",
    orderLimit: "10 Pcs",
    currentInventory: "0",
    inventoryColor: "red",
  },
  {
    id: "2",
    item: "Middle Eastern Roast Beef",
    supplier: "Patria Pastry",
    shortage: 10,
    status: "Sufficient stock",
    orderLimit: "10 Pcs",
    currentInventory: "27",
    inventoryColor: "green",
  },
  {
    id: "3",
    item: "Layaly Lebnan - M",
    supplier: "Patria Pastry",
    shortage: 10,
    status: "Low",
    orderLimit: "10 Pcs",
    currentInventory: "12",
    inventoryColor: "warning",
  },
  {
    id: "4",
    item: "Kunafa Tiramisu - M",
    supplier: "-",
    shortage: 10,
    status: "Low",
    orderLimit: "10 Pcs",
    currentInventory: "10",
    inventoryColor: "warning",
  },
  {
    id: "5",
    item: "Banoffy Kunafa - L",
    supplier: "-",
    shortage: 10,
    status: "Low",
    orderLimit: "10 Pcs",
    currentInventory: "15",
    inventoryColor: "warning",
  },
];

const ReorderView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {/* Information Banner Card */}
      <div className="flex items-center gap-2.5 rounded-[10px] border border-[#C7861E] bg-[#FE9A00]/10 px-4 py-3">
        <AlertTriangle className="size-4.5 text-[#C7861E] shrink-0" />
        <span className="text-[14px] font-semibold tracking-[0.28px] text-[#C7861E]">
          930 {t("items require reordering.")}
        </span>
      </div>

      {/* Table Container */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ITEM")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("CURRENT INVENTORY")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ORDER LIMIT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SHORTAGE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SUPPLIER")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("STATUS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REORDER_ROWS.map((row) => (
              <TableRow key={row.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                  {row.item}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                  <span
                    className={`text-[14px] font-semibold tracking-[0.28px] ${
                      row.inventoryColor === "green"
                        ? "text-[#059B5A]"
                        : row.inventoryColor === "red"
                        ? "text-[#C90000]"
                        : "text-[#C7861E]"
                    }`}
                  >
                    {row.currentInventory}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.orderLimit}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                  {row.shortage}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {row.supplier}
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    {row.status === "Sufficient stock" ? (
                      <Badge className="h-6 px-3 rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Sufficient stock")}
                      </Badge>
                    ) : row.status === "Out of Stock" ? (
                      <Badge className="h-6 px-3 rounded-[30px] bg-[#C90000] text-white border border-[#C90000] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Out of Stock")}
                      </Badge>
                    ) : (
                      <Badge className="h-6 px-3 rounded-[30px] bg-[#FE9A00]/10 text-[#C7861E] border border-[#C7861E] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Low")}
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

export default ReorderView;
