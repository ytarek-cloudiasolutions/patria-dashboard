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
  Pending: "border-[#C7861E] bg-[rgba(254,154,0,0.1)] text-[#C7861E]",
  Confirmed: "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  Delivered: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  "On the Way": "border-[#7E00D7] bg-[#F3E9FA] text-[#9524E4]",
  Cancelled: "border-[#C90000] bg-[#C90000] text-white",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-24 justify-center rounded-[30px] border px-3 py-0 text-[11px] font-semibold",
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
      <div className="flex flex-col gap-3 border-b border-[#E5E5E5] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
            icon: <FileDown className="size-4.5 text-[#8F6900]" />,
            onClick: onDownload,
            className:
              "h-10 border-transparent bg-[#F5F0EA] text-[#8F6900] hover:bg-[#F5F0EA] hover:text-[#8F6900] active:translate-y-0 shadow-none ring-0 focus:ring-0 sm:h-11",
          }}
        />
      </div>

      {/* Mobile list */}
      <div className="divide-y divide-[#E5E5E5] md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="px-4 py-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-bold text-[#333333]">
                  {order.orderNo}
                </p>
                <p className="text-[14px] font-medium text-black">{order.customer}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-medium text-black">{order.date}</span>
              <span className="font-medium text-black" dir="ltr">
                {formatTotal(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block w-full min-w-0 [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:overflow-hidden">
        <Table className="w-full table-fixed">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[28%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA]">
              <TableHead className="px-2 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">{t("ORDER NO.")}</TableHead>
              <TableHead className="px-2 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">{t("CUSTOMER")}</TableHead>
              <TableHead className="px-2 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">{t("DATE")}</TableHead>
              <TableHead className="px-2 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">{t("STATUS")}</TableHead>
              <TableHead className="px-2 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">{t("TOTAL")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="px-2 py-4 text-center text-[12px] font-bold text-[#333333] truncate">
                  {order.orderNo}
                </TableCell>
                <TableCell className="px-2 py-4 text-center text-[14px] font-medium text-black truncate">
                  {order.customer}
                </TableCell>
                <TableCell className="px-2 py-4 text-center text-[14px] font-medium text-black whitespace-nowrap">
                  {order.date}
                </TableCell>
                <TableCell className="px-2 py-4 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={order.status} />
                  </div>
                </TableCell>
                <TableCell className="px-2 py-4 text-center text-[14px] font-medium text-black whitespace-nowrap" dir="ltr">
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
