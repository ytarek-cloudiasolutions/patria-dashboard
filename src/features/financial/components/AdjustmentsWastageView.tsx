import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
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
import { showSuccessToast } from "@/shared/utils/toast";
import { api } from "@/config/api";

interface AdjustmentRecord {
  id: string;
  number: string;
  type: string;
  warehouse: string;
  date: string;
  value: string;
  noOfItems: number;
  status: string;
}

interface AdjustmentsWastageViewProps {
  refreshKey?: number;
}

const AdjustmentsWastageView = ({ refreshKey }: AdjustmentsWastageViewProps) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<AdjustmentRecord[]>([]);

  useEffect(() => {
    api
      .get("/inventory/adjustments")
      .then((res) => {
        const adjustments = res.data?.adjustments || [];
        setRecords(
          adjustments.map((a: any) => ({
            id: a._id,
            number: a.number,
            type: a.type,
            warehouse: a.warehouseId?.name || "—",
            date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—",
            value: String(
              a.items?.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0) ?? 0,
            ),
            noOfItems: a.items?.length || 0,
            status: a.status === "completed" ? "Completed" : "In Progress",
          })),
        );
      })
      .catch(() => setRecords([]));
  }, [refreshKey]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccessToast(`${t("Copied")} ${text}`);
  };

  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F5F0EA] border-none">
            <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("NUMBER")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("TYPE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("WAREHOUSE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("DATE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("VALUE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("NO. OF ITEMS")}
            </TableHead>
            <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("STATUS")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow className="border-none">
              <TableCell
                colSpan={7}
                className="py-12 text-center text-[14px] font-bold tracking-[0.28px] text-[#28293D]"
              >
                {t("No Data Found")}
              </TableCell>
            </TableRow>
          ) : (
            records.map((rec) => (
              <TableRow key={rec.id} className="border-none hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold tracking-[0.28px] text-[#28293D]">
                      {rec.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(rec.number)}
                      title={t("Copy")}
                      className="text-black hover:text-[#8F6900] transition-colors cursor-pointer"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                  {rec.type}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black">
                  {rec.warehouse}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black" dir="ltr">
                  {rec.date}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                  {rec.value}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                  {rec.noOfItems}
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    <Badge className="h-[34px] w-[160px] justify-center rounded-[30px] bg-[#EDF4FB] text-[#3574FF] border border-[#004EF9] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                      {t(rec.status)}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdjustmentsWastageView;
