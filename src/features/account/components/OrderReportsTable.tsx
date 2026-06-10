import { BarChart3, FileDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { OrderReport, OrderStatus } from "../types";

interface OrderReportsTableProps {
  orders: OrderReport[];
  count: number;
  onDownload?: () => void;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "border-[#C7861E] bg-[#FFF5DC] text-[#C7861E]",
  Confirmed: "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  Delivered: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  "On the Way": "border-[#7E00D7] bg-[#F3E9FA] text-[#9524E4]",
  Cancelled: "border-[#C90000] bg-[#FFF0F0] text-[#C90000]",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-24 rounded-full border px-3 py-0 text-[11px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </Badge>
  );
};

const formatTotal = (total: number | null) =>
  total === null
    ? "-"
    : `EGP ${total.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;

const OrderReportsTable = ({
  orders,
  count,
  onDownload,
}: OrderReportsTableProps) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
      {/* Applications + download bar */}
      <div className="flex flex-col gap-3 border-b border-[#E5E5E5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-[#000000]">
            <BarChart3 size={24} />
          </span>
          <p className="text-[14px] font-semibold text-[#333333] sm:text-[15px]">
            {count} {t("applications within the specified period")}
          </p>
        </div>
        <DefaultButton
          data={{
            buttonText: t("Download EXCEL"),
            icon: <FileDown className="size-4.5" />,
            variant: "outline",
            onClick: onDownload,
            className:
              "h-10 border-transparent bg-[#F5F0EA] text-primary hover:bg-[#EFE7DA] hover:text-primary sm:h-11",
          }}
        />
      </div>

      {/* Mobile list */}
      <div className="divide-y divide-[#E5E5E5] md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="px-4 py-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#333333]" >
                  {order.orderNo}
                </p>
                <p className="text-[13px] text-[#000000]">{order.customer}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#8B8B8B]" >{order.date}</span>
              <span className="font-semibold text-[#000000]" >
                {formatTotal(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("ORDER NO.")}</TableHead>
              <TableHead className="px-6 py-4">{t("CUSTOMER")}</TableHead>
              <TableHead className="px-6 py-4">{t("DATE")}</TableHead>
              <TableHead className="px-6 py-4">{t("STATUS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("TOTAL")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 text-[13px] font-semibold text-[#333333]" >
                  {order.orderNo}
                </TableCell>
                <TableCell className="px-6 py-4 font-semibold text-[14px] text-[#000000]">
                  {order.customer}
                </TableCell>
                <TableCell className="px-6 py-4 text-[13px] font-semibold text-[#000000]" >
                  {order.date}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="pe-6 py-4 text-[14px] font-semibold text-[#000000] text-end" >
                  {formatTotal(order.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderReportsTable;
