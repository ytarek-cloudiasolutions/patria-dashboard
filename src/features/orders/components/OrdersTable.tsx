import { ChevronDown, Info, MessageCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ORDER_STATUS_OPTIONS } from "../data";
import type { Order, OrderStatus, PaymentState } from "../types";
import OrdersStatusBadge from "./OrdersStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onStatusMenuOpenChange?: (open: boolean) => void;
}

const paymentStateStyles: Record<Exclude<PaymentState, "None">, string> = {
  Paid: "border-[#00A86B] bg-[#E2F4ED] text-[#00A86B]",
  "Waiting for payment": "border-[#C7861E] bg-[#FFF7E6] text-[#C7861E]",
};

const OrdersTable = ({
  orders,
  onViewOrder,
  onUpdateStatus,
  onStatusMenuOpenChange,
}: OrdersTableProps) => {
  return (
    <>
      <Table>
        <colgroup>
          <col className="w-28.5" />
          <col className="w-34.25" />
          <col className="w-54.25" />
          <col className="w-34.25" />
          <col className="w-34.25" />
          <col className="w-31" />
          <col className="w-27.5" />
        </colgroup>
        <TableHeader>
          <TableRow className="h-10">
            {[
              "Order ID",
              "Customer",
              "Products",
              "Total",
              "Payment",
              "Status",
              "Date",
            ].map((header) => (
              <TableHead key={header} className="text-center">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="px-4 py-12 text-center text-[14px] text-[#5b4f4f]"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => {
              const isLast = index === orders.length - 1;
              const borderClassName = isLast ? "" : "border-b border-[#CACBD4]";
              const edgeLineClassName = isLast
                ? ""
                : "after:absolute after:bottom-0 after:h-px after:bg-[#CACBD4] after:content-['']";

              return (
                <TableRow key={order.id}>
                  <TableCell
                    className={`relative text-center ${edgeLineClassName} after:left-5 after:right-0`}
                  >
                    <button
                      type="button"
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center gap-2 text-[12px] font-bold text-[#333333] cursor-pointer"
                    >
                      #{order.id}
                      <Info className="size-4.5 text-[#23252A]" />
                    </button>
                  </TableCell>

                  <TableCell className={`text-center ${borderClassName}`}>
                    <div className="flex flex-col items-start">
                      <p className="text-[14px] font-semibold text-[#333333]">
                        {order.customerName}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[12px] text-[#8B8B8B]">
                          {order.customerPhone}
                        </span>
                        <MessageCircle className="size-3.5 text-[#00A86B]" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell
                    className={`py-4.25 text-center ${borderClassName}`}
                  >
                    <div className="flex max-w-62 flex-col gap-2.5 items-center">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="inline-flex h-6.75 w-fit max-w-full items-center gap-6 rounded-[8px] bg-[#F5F0EA] px-3 py-1.5 text-[12px]"
                        >
                          <span className="truncate font-medium text-[#000000]">
                            <span className="font-semibold">
                              {item.quantity}X
                            </span>{" "}
                            {item.name}
                          </span>
                          <span className="shrink-0 font-semibold text-[#595959]">
                            <span className="font-medium">EGP</span>{" "}
                            {item.unitPrice}
                          </span>
                        </div>
                      ))}
                      {order.items.some((item) => item.note) && (
                        <span className="inline-flex h-6 w-fit items-center rounded-[30px] border border-[#C7861E] bg-[#FFF7E6] px-3 py-1 text-[13px] font-semibold text-[#C7861E]">
                          Note: {order.items.find((item) => item.note)?.note}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell
                    className={`text-center text-[14px] text-[#28293D] ${borderClassName}`}
                  >
                    <span className="font-semibold">
                      <span className="font-medium">EGP</span>{" "}
                      {order.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>

                  <TableCell className={`text-center ${borderClassName}`}>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="inline-flex h-6 min-w-22 items-center justify-center rounded-full border border-current bg-[#EDF4FB] px-3 py-1 text-[13px] font-semibold text-[#004EF9]">
                        {order.paymentMethod}
                      </span>
                      {order.paymentState !== "None" && (
                        <span
                          className={`inline-flex h-4.5 items-center justify-center rounded-full border px-1.5 py-1 text-[8px] font-semibold ${
                            paymentStateStyles[order.paymentState]
                          }`}
                        >
                          {order.paymentState}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className={`text-start ${borderClassName}`}>
                    <DropdownMenu
                      onOpenChange={(open) => {
                        onStatusMenuOpenChange?.(open);
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-6 border-transparent px-0 ring-0 hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 aria-expanded:bg-transparent aria-expanded:text-inherit data-[state=open]:bg-transparent cursor-pointer"
                        >
                          <OrdersStatusBadge status={order.status} />
                          <ChevronDown className="ml-3 size-4.5 text-[#000000]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="z-70 w-px rounded-[16px] p-2 ring-0"
                      >
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onSelect={() => onUpdateStatus(order.id, status)}
                            className={`rounded-[16px] px-3 py-2 text-[12px] font-medium cursor-pointer ${
                              order.status === status
                                ? "bg-primary text-primary-foreground pointer-events-none"
                                : "text-[#28293D] data-highlighted:bg-[#F5F0EA]"
                            }`}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell
                    className={`relative text-center text-[12px] font-medium leading-tight text-[#23252A] ${edgeLineClassName} after:left-0 after:right-8`}
                  >
                    <span>{order.date},</span>
                    <br />
                    <span>{order.time}</span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersTable;
