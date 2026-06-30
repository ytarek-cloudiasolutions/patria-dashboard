import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { InventoryItem } from "../types";

const STATUS_STYLES: Record<string, string> = {
  "Out Of Stock": "bg-[#FFF0F0] text-[#C90000] border-[#C90000]",
  "Low Stock": "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]",
  Available: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
};

interface StockStatusTableProps {
  items: InventoryItem[];
  adjustments: Record<string | number, number>;
  onAdjust: (id: string | number, value: number) => void;
}

const StockStatusTable = ({
  items,
  adjustments,
  onAdjust,
}: StockStatusTableProps) => {
  const { t } = useTranslation();
  const getQty = (item: InventoryItem) =>
    adjustments[item.id] ?? item.currentQuantity;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-5 py-4 text-start">{t("PRODUCT")}</TableHead>
          <TableHead className="text-center">{t("CATEGORY")}</TableHead>
          <TableHead className="text-center">{t("CURRENT QUANTITY")}</TableHead>
          <TableHead className="text-center">{t("MINIMUM QUANTITY")}</TableHead>
          <TableHead className="text-center">{t("STATUS")}</TableHead>
          <TableHead className="pe-5 text-center">{t("ADJUST QUANTITY")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-12 text-center text-[14px] text-[#8B8B8B]"
            >
              {t("No items found.")}
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => {
            const qty = getQty(item);
            return (
              <TableRow key={item.id}>
                <TableCell className="ps-5 py-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-10 rounded-[8px] object-cover shrink-0"
                      />
                    )}
                    <span className="text-[14px] font-normal text-[#333333]">
                      {item.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge className="h-6 px-3 rounded-[30px] text-[12px] font-normal border border-[#624f1c] bg-[#8f6900] text-white">
                    {item.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <span className="text-[14px] font-medium text-black">
                    {item.currentQuantity}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <span className="text-[14px] font-medium text-black">
                    {item.minimumQuantity}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={`h-6 px-3 rounded-[30px] text-[12px] font-normal border ${
                      STATUS_STYLES[item.status] ?? ""
                    }`}
                  >
                    {t(item.status)}
                  </Badge>
                </TableCell>

                <TableCell className="pe-5">
                  <input
                    type="number"
                    min="0"
                    value={qty}
                    onChange={(e) =>
                      onAdjust(item.id, Math.max(0, Number(e.target.value)))
                    }
                    className={`w-full h-11.5 rounded-xl border border-neutral-200 bg-white px-3 text-[16px] text-center outline-none focus:border-primary transition-colors ${
                      qty === 0 ? "text-[#8b8b8b]" : "text-black"
                    }`}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default StockStatusTable;
