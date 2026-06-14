import { Fragment } from "react";
import { ChevronDown, Info } from "lucide-react";
import Whatsapp from "@/assets/icons/whatsapp.svg";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { DRIVERS, ORDER_STATUS_OPTIONS } from "../data";
import type { Order, OrderStatus, PaymentState } from "../types";
import OrdersStatusBadge from "./OrdersStatusBadge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { translatePaymentMethod } from "../utils";

interface OrdersTableProps {
  orders: Order[];
  selectedIds: string[];
  onToggleSelected: (orderId: string) => void;
  onToggleSelectAll: () => void;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAssignDriver: (orderId: string, driver: string) => void;
  onStatusMenuOpenChange?: (open: boolean) => void;
}

const paymentStateStyles: Record<Exclude<PaymentState, "None">, string> = {
  Paid: "border-[#00A86B] bg-[#E2F4ED] text-[#00A86B]",
  "Waiting for payment": "border-[#C7861E] bg-[#FFF7E6] text-[#C7861E]",
};

const OrdersTable = ({
  orders,
  selectedIds,
  onToggleSelected,
  onToggleSelectAll,
  onViewOrder,
  onUpdateStatus,
  onAssignDriver,
  onStatusMenuOpenChange,
}: OrdersTableProps) => {
  const { t } = useTranslation();

  const allSelected =
    orders.length > 0 && selectedIds.length === orders.length;

  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[#E5E5E5]">
      <Table className="min-w-[820px]">
        <colgroup>
          <col className="w-10" />
          <col className="w-28" />
          <col className="w-36" />
          <col className="w-52" />
          <col className="w-28" />
          <col className="w-32" />
          <col className="w-28" />
          <col className="w-24" />
          <col className="w-28" />
        </colgroup>
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="ps-4 text-center">
              <div className="flex justify-center">
                <div
                  className={`rounded-[10px] p-1 ${
                    allSelected ? "bg-[#624F1C1A]" : ""
                  }`}
                >
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleSelectAll}
                    aria-label="Select all orders"
                    className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
                  />
                </div>
              </div>
            </TableHead>
            {[
              "Order ID",
              "Customer",
              "Products",
              "Total",
              "Payment",
              "Status",
              "Date",
              "Driver",
            ].map((header) => (
              <TableHead key={header} className="text-center">
                {t(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="px-4 py-12 text-center text-[14px] text-[#5b4f4f]"
              >
                {t("No orders found.")}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => {
              const isLast = index === orders.length - 1;

              return (
                <Fragment key={order.id}>
                  <TableRow>
                    <TableCell className="ps-4 text-center">
                      <div className="flex justify-center">
                        <div
                          className={`rounded-[10px] p-1 ${
                            selectedIds.includes(order.id)
                              ? "bg-[#624F1C1A]"
                              : ""
                          }`}
                        >
                          <Checkbox
                            checked={selectedIds.includes(order.id)}
                            onCheckedChange={() => onToggleSelected(order.id)}
                            aria-label={`Select order ${order.id}`}
                            className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => onViewOrder(order)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#333333] cursor-pointer"
                      >
                        #{order.id}
                        <Info className="size-4 text-[#23252A]" />
                      </button>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-start">
                        <p className="text-[13px] font-semibold text-[#333333]">
                          {order.customerName}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[11px] text-[#8B8B8B]" dir="ltr">
                            {order.customerPhone}
                          </span>
                          <img
                            src={Whatsapp}
                            alt="Whatsapp"
                            className="size-4"
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onViewOrder(order)}
                        className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[8px] bg-[#F5F0EA] px-3 text-[13px] text-[#333333]"
                      >
                        <span>
                          <span className="font-semibold">
                            {order.items.length}
                          </span>{" "}
                          {t("Products")}
                        </span>
                        <Info className="size-3.5 text-[#23252A]" />
                      </button>
                    </TableCell>

                    <TableCell className="text-center text-[13px] text-[#28293D]">
                      <span className="font-semibold whitespace-nowrap">
                        <span className="font-medium">EGP</span>{" "}
                        {order.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="inline-flex h-6 min-w-20 items-center justify-center rounded-full border border-current bg-[#EDF4FB] px-2.5 py-1 text-[11px] font-semibold text-[#004EF9]">
                          {translatePaymentMethod(order.paymentMethod, t)}
                        </span>
                        {order.paymentState !== "None" && (
                          <span
                            className={`inline-flex h-4.5 items-center justify-center rounded-full border px-1.5 py-1 text-[8px] font-semibold ${
                              paymentStateStyles[order.paymentState]
                            }`}
                          >
                            {t(order.paymentState)}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-start">
                      <DropdownMenu onOpenChange={onStatusMenuOpenChange}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-6 border-transparent px-0 ring-0 hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 aria-expanded:bg-transparent aria-expanded:text-inherit data-[state=open]:bg-transparent cursor-pointer"
                          >
                            <OrdersStatusBadge status={order.status} />
                            <ChevronDown className="ml-2 size-4 text-[#000000]" />
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
                              {t(status)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    <TableCell className="text-center text-[11px] font-medium leading-tight text-[#23252A]" dir="ltr">
                      <span className="whitespace-nowrap">{order.date},</span>
                      <br />
                      <span>{order.time}</span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DriverCell
                        driver={order.driver}
                        onAssign={(driver) => onAssignDriver(order.id, driver)}
                        onOpenChange={onStatusMenuOpenChange}
                      />
                    </TableCell>
                  </TableRow>
                  {!isLast && (
                    <TableRow className="h-0 hover:bg-transparent data-[state=selected]:bg-transparent">
                      <TableCell colSpan={9} className="p-0">
                        <div className="mx-6 h-px bg-[#CACBD4]" />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

interface DriverCellProps {
  driver?: string;
  onAssign: (driver: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const DriverCell = ({ driver, onAssign, onOpenChange }: DriverCellProps) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {driver ? (
          <button
            type="button"
            className="inline-flex h-7 cursor-pointer items-center justify-center rounded-full bg-[#DCDCDC] px-4 text-[12px] font-semibold text-[#23252A]"
          >
            {driver}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#8B16FF]/30 bg-[#F4E8FF] px-3 text-[12px] font-semibold text-[#8B16FF]"
          >
            {t("Rider")}
            <ChevronDown className="size-3.5" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-70 w-40 rounded-[16px] p-2 ring-0"
      >
        {DRIVERS.map((d) => (
          <DropdownMenuItem
            key={d.id}
            onSelect={() => onAssign(d.name)}
            className={`rounded-[12px] px-3 py-2 text-[12px] font-medium cursor-pointer ${
              driver === d.name
                ? "bg-primary text-primary-foreground pointer-events-none"
                : "text-[#28293D] data-highlighted:bg-[#F5F0EA]"
            }`}
          >
            {d.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrdersTable;
