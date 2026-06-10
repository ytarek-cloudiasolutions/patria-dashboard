import { Box } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";
import TransferStatusBadge from "./TransferStatusBadge";
import type { InternalTransfer } from "../types";

interface TransfersTableProps {
  transfers: InternalTransfer[];
}

const ItemsCount = ({
  count,
  itemLabel,
  itemsLabel,
}: {
  count: number;
  itemLabel: string;
  itemsLabel: string;
}) => (
  <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#28293D]">
    <Box size={14} className="text-[#595959]" />
    {count} {count === 1 ? itemLabel : itemsLabel}
  </div>
);

const TransfersTable = ({ transfers }: TransfersTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-[#28293D]" dir="ltr">
                {transfer.reference}
              </p>
              <TransferStatusBadge status={transfer.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("From")}
                </p>
                <p className="text-[#28293D]">{transfer.fromName}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("To")}
                </p>
                <p className="text-[#28293D]">{transfer.toName}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Items")}
                </p>
                <ItemsCount
                  count={transfer.items.length}
                  itemLabel={t("Item")}
                  itemsLabel={t("Items")}
                />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Date")}
                </p>
                <p className="text-[#28293D]" dir="ltr">{transfer.createdAt}</p>
              </div>
            </div>
          </div>
        ))}

        {transfers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No transfers yet.")}
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("ID")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("FROM")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("TO")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("ITEMS")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("DATE")}</TableHead>
              <TableHead className="pe-6 py-4 text-start">{t("STATUS")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {transfer.reference}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {transfer.fromName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {transfer.toName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <ItemsCount
                    count={transfer.items.length}
                    itemLabel={t("Item")}
                    itemsLabel={t("Items")}
                  />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[13px] text-[#5A5A66]">
                  {transfer.createdAt}
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <TransferStatusBadge status={transfer.status} />
                </TableCell>
              </TableRow>
            ))}

            {transfers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No transfers yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TransfersTable;
