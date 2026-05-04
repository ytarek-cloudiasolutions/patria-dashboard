import { BarChart2, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Order } from "../types";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderReportsTableProps {
  orders: Order[];
  totalInPeriod: number;
  onDownloadExcel?: () => void;
}

const OrderReportsTable = ({
  orders,
  totalInPeriod,
  onDownloadExcel,
}: OrderReportsTableProps) => {
  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2 text-[#28293D] text-[13px] font-semibold">
          <BarChart2 size={16} className="text-[#8B6914]" />
          <span>{totalInPeriod} applications within the specified period</span>
        </div>
        <button
          onClick={onDownloadExcel}
          className="flex items-center gap-1.5 text-[#595959] text-[12px] font-medium hover:text-[#28293D] transition-colors"
        >
          <Download size={14} />
          Download EXCEL
        </button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">ORDER NO.</TableHead>
            <TableHead>CUSTOMER</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="pr-5 text-right">TOTAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={`${order.orderNo}-${index}`}
              className="border-b border-[#F0F0F0] last:border-0"
            >
              <TableCell className="pl-5 text-[#28293D] text-[13px] font-medium">
                {order.orderNo}
              </TableCell>
              <TableCell className="text-[#28293D] text-[13px]">
                {order.customer}
              </TableCell>
              <TableCell className="text-[#595959] text-[13px]">
                {order.date}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="pr-5 text-right text-[#28293D] text-[13px] font-medium">
                {order.total ?? "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderReportsTable;
