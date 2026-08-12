import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
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
import { api } from "@/config/api";

interface ReorderRow {
  productId: string;
  name: string;
  currentInventory: number;
  orderLimit: number;
  shortage: number;
  supplier: string | null;
}

const statusFor = (row: ReorderRow): "Sufficient stock" | "Out of Stock" | "Low" => {
  if (row.currentInventory <= 0) return "Out of Stock";
  if (row.currentInventory <= row.orderLimit) return "Low";
  return "Sufficient stock";
};

const ReorderView = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ReorderRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/inventory/reorder")
      .then((response) => {
        if (cancelled) return;
        setRows(response.data?.items ?? []);
        setCount(response.data?.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
          setCount(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Information Banner Card */}
      <div className="flex items-center gap-2.5 rounded-[10px] border border-[#C7861E] bg-[#FE9A00]/10 px-4 py-3">
        <AlertTriangle className="size-4.5 text-[#C7861E] shrink-0" />
        <span className="text-[14px] font-semibold tracking-[0.28px] text-[#C7861E]">
          {count} {t("items require reordering.")}
        </span>
      </div>

      {/* Table Container */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-[#8F6900]" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#8B8B8B]">
            {t("No items currently need reordering")}
          </p>
        ) : (
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
              {rows.map((row) => {
                const status = statusFor(row);
                return (
                  <TableRow key={row.productId} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                    <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                      {row.name}
                    </TableCell>
                    <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                      <span
                        className={`text-[14px] font-semibold tracking-[0.28px] ${
                          status === "Sufficient stock"
                            ? "text-[#059B5A]"
                            : status === "Out of Stock"
                            ? "text-[#C90000]"
                            : "text-[#C7861E]"
                        }`}
                      >
                        {row.currentInventory}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                      {row.orderLimit} {t("Pcs")}
                    </TableCell>
                    <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                      {row.shortage}
                    </TableCell>
                    <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                      {row.supplier || "-"}
                    </TableCell>
                    <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                      <div className="inline-flex justify-center">
                        {status === "Sufficient stock" ? (
                          <Badge className="h-6 px-3 rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                            {t("Sufficient stock")}
                          </Badge>
                        ) : status === "Out of Stock" ? (
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ReorderView;
