import { Box } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import TransferStatusBadge from "./TransferStatusBadge";
import type { InternalTransfer } from "../types";

interface TransfersTableProps {
  transfers: InternalTransfer[];
}

const ItemsCount = ({ count }: { count: number }) => (
  <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#28293D]">
    <Box size={14} className="text-[#595959]" />
    {count} {count === 1 ? "Item" : "Items"}
  </div>
);

const TransfersTable = ({ transfers }: TransfersTableProps) => {
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
              <p className="text-[14px] font-semibold text-[#28293D]">
                {transfer.reference}
              </p>
              <TransferStatusBadge status={transfer.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  From
                </p>
                <p className="text-[#28293D]">{transfer.fromName}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  To
                </p>
                <p className="text-[#28293D]">{transfer.toName}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Items
                </p>
                <ItemsCount count={transfer.items.length} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Date
                </p>
                <p className="text-[#28293D]">{transfer.createdAt}</p>
              </div>
            </div>
          </div>
        ))}

        {transfers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            No transfers yet.
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">ID</TableHead>
              <TableHead className="px-6 py-4">FROM</TableHead>
              <TableHead className="px-6 py-4">TO</TableHead>
              <TableHead className="px-6 py-4">ITEMS</TableHead>
              <TableHead className="px-6 py-4">DATE</TableHead>
              <TableHead className="px-6 py-4">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {transfer.reference}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {transfer.fromName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {transfer.toName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <ItemsCount count={transfer.items.length} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[13px] text-[#5A5A66]">
                  {transfer.createdAt}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
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
                  No transfers yet.
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
