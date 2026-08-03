import { useEffect, useState } from "react";
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
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { api } from "@/config/api";
import type { OpeningBalanceRecord } from "../types";
import ConfirmOpeningBalanceDialog from "./ConfirmOpeningBalanceDialog";

const formatEgp = (value: number) =>
  `EGP ${value.toFixed(2)}`;

interface OpeningBalanceViewProps {
  refreshKey?: number;
}

const OpeningBalanceView = ({ refreshKey }: OpeningBalanceViewProps) => {
  const { t } = useTranslation();
  const [selectedRecord, setSelectedRecord] = useState<OpeningBalanceRecord | null>(null);
  const [records, setRecords] = useState<OpeningBalanceRecord[]>([]);

  const loadRecords = () => {
    api
      .get("/inventory/opening-balances")
      .then((res) => {
        const balances = res.data?.balances || [];
        setRecords(
          balances.map((b: any) => ({
            id: b._id,
            number: b.number,
            warehouse: b.warehouseId?.name || "—",
            periodStart: b.periodStart ? new Date(b.periodStart).toLocaleDateString() : "—",
            totalValue: (b.items || []).reduce(
              (sum: number, i: any) => sum + (i.quantity || 0) * (i.unitCost || 0),
              0,
            ),
            noOfItems: b.items?.length || 0,
            status: b.status,
          })),
        );
      })
      .catch(() => setRecords([]));
  };

  useEffect(loadRecords, [refreshKey]);

  const handleConfirmRecord = async (record?: OpeningBalanceRecord | null) => {
    if (!record) return;
    try {
      await api.put(`/inventory/opening-balances/${record.id}/confirm`);
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, status: "Confirmed" as const } : r))
      );
      showSuccessToast(t("Opening balance confirmed and applied to inventory"));
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.message || t("Failed to confirm opening balance"),
      );
    }
  };

  return (
    <>
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-none">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("NUMBER")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("WAREHOUSE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PERIOD START")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("TOTAL VALUE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("NUMBER OF ITEMS")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("STATUS")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={rec.id} className="border-none hover:bg-[#FAFAF8]">
                <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                  {rec.number}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black">
                  {rec.warehouse}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black" dir="ltr">
                  {rec.periodStart}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-semibold tracking-[0.28px] text-[#333333]" dir="ltr">
                  {formatEgp(rec.totalValue)}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                  {rec.noOfItems}
                </TableCell>
                <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    {rec.status === "Confirmed" ? (
                      <Badge className="h-[34px] w-[140px] justify-center rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t("Confirmed")}
                      </Badge>
                    ) : (
                      <Badge className="h-[34px] w-[140px] justify-center rounded-[30px] bg-[rgba(254,154,0,0.10)] text-[#C7861E] border border-[#C7861E] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t(rec.status)}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                  <div className="inline-flex justify-center">
                    {rec.status === "Draft" && (
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(rec)}
                        className="h-[34px] w-[100px] inline-flex items-center justify-center rounded-[6px] bg-[#E2F4ED] text-[12px] font-semibold text-[#059B5A] hover:bg-[#D4EFE4] transition-colors cursor-pointer"
                      >
                        {t("Confirm")}
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmOpeningBalanceDialog
        open={Boolean(selectedRecord)}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null);
        }}
        record={selectedRecord}
        onConfirm={handleConfirmRecord}
      />
    </>
  );
};

export default OpeningBalanceView;
