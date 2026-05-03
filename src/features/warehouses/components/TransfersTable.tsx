import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Package } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Transfer } from "../types";

interface TransfersTableProps {
  transfers: Transfer[];
}

const statusStyles: Record<Transfer["status"], string> = {
  Pending: "border border-[#F5D8A8] bg-white text-[#B56C00]",
  Approved: "border border-[#A8DFC4] bg-white text-[#1A7A45]",
  Rejected: "border border-[#F5A8A8] bg-white text-[#C90000]",
};

const TransfersTable = ({ transfers }: TransfersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-3">ID</TableHead>
          <TableHead className="px-5 py-3">FROM</TableHead>
          <TableHead className="px-5 py-3">TO</TableHead>
          <TableHead className="px-5 py-3">ITEMS</TableHead>
          <TableHead className="px-5 py-3">DATE</TableHead>
          <TableHead className="px-5 py-3">STATUS</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transfers.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="px-5 py-10 text-center text-[14px] text-[#8B8B8B]"
            >
              No transfers found.
            </TableCell>
          </TableRow>
        ) : (
          transfers.map((transfer) => (
            <TableRow key={transfer.id} className="hover:bg-[#FAFAF8]">
              <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                {transfer.id}
              </TableCell>
              <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                {transfer.from}
              </TableCell>
              <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                {transfer.to}
              </TableCell>
              <TableCell className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-[14px] text-[#28293D]">
                  <Package size={14} className="text-[#6B6B6B]" />
                  {transfer.items} Items
                </div>
              </TableCell>
              <TableCell className="px-5 py-4 text-[14px] font-semibold text-[#28293D]">
                {transfer.date}
              </TableCell>
              <TableCell className="px-5 py-4">
                <span
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[12px] font-semibold",
                    statusStyles[transfer.status]
                  )}
                >
                  {transfer.status}
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TransfersTable;
