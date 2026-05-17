import { BarChart2, Download } from "lucide-react";
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
    <div className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE9E0] px-[19px] py-[14px]">
        <div className="flex items-center gap-[13px] text-[16px] font-semibold text-[#333333]">
          <BarChart2 size={24} className="text-[#000000]" strokeWidth={1.9} />
          <span>{totalInPeriod} applications within the specified period</span>
        </div>
        <button
          type="button"
          onClick={onDownloadExcel}
          className="flex h-[43px] items-center gap-3 rounded-[5px] bg-[#F5F0EA] px-[27px] text-[14px] font-medium text-primary transition-colors hover:bg-[#EEE4D7]"
        >
          <Download size={16} />
          Download EXCEL
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] caption-bottom text-sm">
          <thead className="bg-[#F5F0EA] text-[13px] font-semibold text-[#28293D]">
            <tr>
              <th className="h-[43px] pl-[29px] text-left align-middle whitespace-nowrap">
                ORDER NO.
              </th>
              <th className="h-[43px] px-2 text-left align-middle whitespace-nowrap">
                CUSTOMER
              </th>
              <th className="h-[43px] px-2 text-left align-middle whitespace-nowrap">
                DATE
              </th>
              <th className="h-[43px] px-2 text-left align-middle whitespace-nowrap">
                STATUS
              </th>
              <th className="h-[43px] pr-[63px] text-right align-middle whitespace-nowrap">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.map((order, index) => (
              <tr key={`${order.orderNo}-${index}`}>
                <td className="h-[49px] pl-[29px] align-middle text-[13px] font-bold whitespace-nowrap text-[#333333]">
                  {order.orderNo}
                </td>
                <td className="px-2 align-middle text-[15px] font-medium whitespace-nowrap text-[#000000]">
                  {order.customer}
                </td>
                <td className="px-2 align-middle text-[15px] font-medium whitespace-nowrap text-[#000000]">
                  {order.date}
                </td>
                <td className="px-2 align-middle whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="pr-[63px] text-right align-middle text-[15px] font-semibold whitespace-nowrap text-[#000000]">
                  {order.total ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderReportsTable;
