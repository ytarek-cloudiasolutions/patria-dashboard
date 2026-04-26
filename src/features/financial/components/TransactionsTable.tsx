import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Transaction } from "../types";
import { categoryColorMap } from "../data";

interface Props {
  transactions: Transaction[];
  showStatus?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const TransactionsTable = ({ transactions, showStatus = false }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">STATEMENT</TableHead>
          <TableHead>CATEGORY</TableHead>
          <TableHead>AMOUNT</TableHead>
          <TableHead>DATE</TableHead>
          {showStatus && <TableHead>STATUS</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id} className="border-b border-[#F0F0F0]">
            <TableCell className="pl-4 py-4 text-[13px] font-medium text-[#28293D]">
              {txn.statement}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${
                  categoryColorMap[txn.category] ?? categoryColorMap.Other
                }`}
              >
                {txn.category}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`text-[13px] font-semibold ${
                  txn.amount < 0 ? "text-[#C90000]" : "text-[#15803D]"
                }`}
              >
                EGP {txn.amount < 0 ? "-" : ""}
                {Math.abs(txn.amount).toLocaleString()}
              </span>
            </TableCell>
            <TableCell className="text-[13px] text-[#28293D]">
              {formatDate(txn.date)}
            </TableCell>
            {showStatus && (
              <TableCell>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-white text-[#5C4A1E] border border-[#5C4A1E]">
                  {txn.status}
                </span>
              </TableCell>
            )}
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={showStatus ? 5 : 4}
              className="text-center py-10 text-[#8B8B8B] text-[13px]"
            >
              No transactions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
