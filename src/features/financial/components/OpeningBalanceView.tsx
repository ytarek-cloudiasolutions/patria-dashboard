import { useState } from "react";
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
import { OPENING_BALANCE_RECORDS } from "../data";
import type { OpeningBalanceRecord } from "../types";
import ConfirmOpeningBalanceDialog from "./ConfirmOpeningBalanceDialog";

const formatEgp = (value: number) =>
  `EGP ${value.toFixed(2)}`;

const OpeningBalanceView = () => {
  const { t } = useTranslation();
  const [selectedRecord, setSelectedRecord] = useState<OpeningBalanceRecord | null>(null);
  const [records, setRecords] = useState(OPENING_BALANCE_RECORDS);

  const handleConfirmRecord = (record: OpeningBalanceRecord | null) => {
    if (!record) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: "Confirmed" as const } : r))
    );
    showSuccessToast(t("Opening balance confirmed and applied to inventory"));
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
