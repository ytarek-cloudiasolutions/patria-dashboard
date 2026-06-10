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
import { cn } from "@/lib/utils";
import type {
  FinancialTransaction,
  TransactionCategory,
  TransactionStatus,
} from "../types";

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  showStatus?: boolean;
}

const CATEGORY_STYLES: Record<TransactionCategory, string> = {
  Salary: "bg-[#EDF4FB] text-[#3574FF] border-[#003BBE]",
  Rent: "bg-[#F3E9FA] text-[#9524E4] border-[#7E00D7]",
  Other: "bg-[#E5E5E5] text-[#23252A] border-[#595959]",
  Sales: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]/40",
  Utilities: "bg-[#FFF5DC] text-[#B56C00] border-[#B56C00]/40",
  Marketing: "bg-[#F5F0EA] text-primary border-[#624F1C]/40",
};

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Registered: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
  Pending: "bg-[#FFF5DC] text-[#B56C00] border-[#B56C00]/40",
};

const CategoryBadge = ({ category }: { category: TransactionCategory }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 rounded-full border px-3 py-0 text-[11px] font-semibold",
        CATEGORY_STYLES[category],
      )}
    >
      {t(category)}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-7 min-w-24 rounded-full border px-3 py-0 text-[12px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </Badge>
  );
};

const formatEgp = (value: number) => {
  const sign = value < 0 ? "-" : "";
  return `EGP ${sign}${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

const TransactionsTable = ({
  transactions,
  showStatus = false,
}: TransactionsTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#28293D]">
                  {t(tx.statement)}
                </p>
                <p className="mt-1">
                  <CategoryBadge category={tx.category} />
                </p>
              </div>
              {showStatus && <StatusBadge status={tx.status} />}
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Amount")}
                </p>
                <p
                  dir="ltr"
                  className={cn(
                    "font-semibold",
                    tx.amount < 0 ? "text-[#C90000]" : "text-[#059B5A]",
                  )}
                >
                  {formatEgp(tx.amount)}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Date")}
                </p>
                <p className="text-[#28293D]" dir="ltr">{tx.date}</p>
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No transactions yet.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("STATEMENT")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("CATEGORY")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("AMOUNT")}</TableHead>
              <TableHead className={`${showStatus ? "px-6" : "pe-6"} py-4 ${showStatus ? "text-start" : "text-end"}`}>{t("DATE")}</TableHead>
              {showStatus && (
                <TableHead className="pe-6 py-4 text-end">{t("STATUS")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {t(tx.statement)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <CategoryBadge category={tx.category} />
                </TableCell>
                <TableCell
              
                  className={cn(
                    "px-6 py-4 whitespace-nowrap text-[14px] font-semibold",
                    tx.amount < 0 ? "text-[#C90000]" : "text-[#059B5A]",
                  )}
                >
                  {formatEgp(tx.amount)}
                </TableCell>
                <TableCell className={`${showStatus ? "px-6" : "pe-6"} py-4 whitespace-nowrap font-semibold text-[13px] text-[#000000]`} >
                  {tx.date}
                </TableCell>
                {showStatus && (
                  <TableCell className="pe-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <StatusBadge status={tx.status} />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {transactions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={showStatus ? 5 : 4}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No transactions yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TransactionsTable;
