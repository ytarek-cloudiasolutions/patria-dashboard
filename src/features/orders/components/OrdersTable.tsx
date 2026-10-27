import { Fragment, useState } from "react";
import { ChevronDown, Info, Loader2, User } from "lucide-react";
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
import { ORDER_STATUS_OPTIONS } from "../data";
import type { Order, OrderStatus, PaymentState } from "../types";
import OrdersStatusBadge from "./OrdersStatusBadge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { translatePaymentMethod } from "../utils";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  orders: Order[];
  selectedIds: string[];
  onToggleSelected: (orderId: string) => void;
  onToggleSelectAll: () => void;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAssignDriver: (orderId: string, driver: string, updatedOrderData?: any) => void;
  onStatusMenuOpenChange?: (open: boolean) => void;
  isPos?: boolean;
  isStaffTab?: boolean;
  onUpdateStaffStatus?: (orderId: string, status: "Charged to tab" | "Paid") => void;
}

const POS_ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Confirmed",
  "Completed",
  "Cancelled",
];

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
  isPos = false,
  isStaffTab = false,
  onUpdateStaffStatus,
}: OrdersTableProps) => {
  const { t } = useTranslation();

  const allSelected =
    orders.length > 0 && selectedIds.length === orders.length;

  const availableStatuses = isPos
    ? POS_ORDER_STATUS_OPTIONS
    : ORDER_STATUS_OPTIONS;

  const hideDriver = isPos || isStaffTab;

  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[#E5E5E5] bg-white transition-shadow duration-300 hover:shadow-xs">
      <Table className="min-w-[820px]">
        <colgroup>
          <col className="w-10" />
          <col className="w-28" />
          <col className="w-36" />
          <col className="w-44" />
          <col className="w-28" />
          <col className="w-44" />
          <col className="w-32" />
          <col className="w-28" />
          {!hideDriver && <col className="w-28" />}
        </colgroup>
        <TableHeader>
          <TableRow className="h-11 bg-[#F5F0EA] hover:bg-[#F5F0EA] border-b border-[#E5E5E5]">
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
            {(hideDriver
              ? ["ID", "Customer", "Products", "Total", "Payment", "Status", "Date"]
              : ["Order ID", "Customer", "Products", "Total", "Payment", "Status", "Date", "Driver"]
            ).map((header) => (
              <TableHead key={header} className="text-center text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]">
                {t(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={hideDriver ? 8 : 9}
                className="px-4 py-12 text-center text-[14px] text-[#5b4f4f]"
              >
                {t("No orders found.")}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => {
              const isLast = index === orders.length - 1;
              const isNewOrder = Boolean(order.isNew || order.status === "Pending");
              const isStaff =
                (order as any).isStaffOrder ||
                (order as any).orderType === "staff" ||
                order.customerName?.toLowerCase().trim() === "staff";

              const rawPayment = translatePaymentMethod(order.paymentMethod, t);
              let displayPayment = rawPayment;
              if (isPos || isStaffTab) {
                if (rawPayment.toLowerCase().includes("cash on delivery") || rawPayment.toLowerCase() === "cod") {
                  displayPayment = t("Cash");
                }
              } else {
                if (rawPayment.toLowerCase() === "cash") {
                  displayPayment = t("Cash on Delivery");
                }
              }

              return (
                <Fragment key={order.id}>
                  <TableRow
                    className={cn(
                      "transition-colors duration-150",
                      isNewOrder
                        ? "bg-[#F5F0EA] hover:bg-[#EFE6DC]"
                        : "hover:bg-gray-50/80"
                    )}
                  >
                    <TableCell
                      className={cn(
                        "ps-4 text-center relative",
                        isNewOrder &&
                          "before:absolute before:start-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#8F6900]"
                      )}
                    >
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
                        className="group/id inline-flex items-center gap-1.5 text-[12px] font-bold text-[#333333] tracking-[0.24px] cursor-pointer transition-colors duration-150 hover:text-primary active:scale-95"
                      >
                        #{order.orderId || order.id}
                        <Info className="size-4 text-[#23252A] transition-transform duration-200 ease-out group-hover/id:scale-110 group-hover/id:text-primary" />
                      </button>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {isStaffTab ? (
                          <div className="flex flex-col items-center">
                            <span className="text-[13px] font-semibold text-[#28293D] tracking-tight">
                              {order.customerName || t("Staff Member")}
                            </span>
                            {Boolean(order.customerPhone && order.customerPhone.trim()) && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[12px] text-[#8B8B8B]" dir="ltr">
                                  {order.customerPhone}
                                </span>
                                <img
                                  src={Whatsapp}
                                  alt="Whatsapp"
                                  className="size-3.5 transition-transform duration-150 hover:scale-125 cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                        ) : isStaff ? (
                          <div className="flex items-center gap-1.5">
                            <User className="size-4 text-[#333333]" />
                            <span className="text-[12px] font-semibold text-[#333333] tracking-[0.24px]">
                              {t("Staff")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-[12px] font-medium text-[#333333] tracking-[0.24px]">
                              {order.customerName || t("Walk-in Customer")}
                            </span>
                            {Boolean(order.customerPhone && order.customerPhone.trim()) && (
                              <div className="mt-1 flex items-center gap-1">
                                <span className="text-[11px] text-[#8B8B8B]" dir="ltr">
                                  {order.customerPhone}
                                </span>
                                <img
                                  src={Whatsapp}
                                  alt="Whatsapp"
                                  className="size-4 transition-transform duration-150 hover:scale-125 cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-[18px] text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => onViewOrder(order)}
                          className="group/prod inline-flex h-8 cursor-pointer items-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-[#F5F0EA] px-3 text-[13px] text-[#333333] transition-all duration-200 hover:border-[#8F6900]/40 hover:bg-[#FAFAF7] hover:shadow-2xs active:scale-95"
                        >
                          <span>
                            <span className="font-semibold">
                              {order.items.length}
                            </span>{" "}
                            {t("Products")}
                          </span>
                          <Info className="size-3.5 text-[#23252A] transition-transform duration-200 ease-out group-hover/prod:scale-110" />
                        </button>
                      </div>
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
                        <span className="inline-flex min-h-6 min-w-20 items-center justify-center rounded-[30px] outline outline-1 outline-offset-[-1px] outline-blue-700 bg-slate-100 px-3 py-1 text-xs font-semibold text-blue-500 tracking-tight">
                          {displayPayment}
                        </span>
                        {!isStaffTab && order.paymentState !== "None" && (
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

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {isStaffTab ? (
                          <DropdownMenu onOpenChange={onStatusMenuOpenChange}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="group/staffstatus h-6 border-transparent px-0 ring-0 hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 aria-expanded:bg-transparent aria-expanded:text-inherit data-[state=open]:bg-transparent cursor-pointer transition-transform duration-150 active:scale-95"
                              >
                                {((order.staffStatus || (order.paymentState === "Paid" ? "Paid" : "Charged to tab")) === "Charged to tab") ? (
                                  <span className="inline-flex min-h-6 items-center justify-center rounded-[30px] outline outline-1 outline-offset-[-1px] outline-purple-700 bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600 tracking-tight transition-transform duration-200 group-hover/staffstatus:scale-105">
                                    {t("Charged to tab")}
                                  </span>
                                ) : (
                                  <span className="inline-flex min-h-6 items-center justify-center rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#059B5A] bg-[#E2F4ED] px-3 py-1 text-xs font-semibold text-[#059B5A] tracking-tight transition-transform duration-200 group-hover/staffstatus:scale-105">
                                    {t("Paid")}
                                  </span>
                                )}
                                <ChevronDown className="ml-2 size-4 text-[#28293D] transition-transform duration-200 ease-out group-data-[state=open]/staffstatus:rotate-180" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="z-70 w-36 rounded-[16px] p-2 ring-0"
                            >
                              {(["Charged to tab", "Paid"] as const).map((s) => (
                                <DropdownMenuItem
                                  key={s}
                                  onSelect={() => onUpdateStaffStatus?.(order.id, s)}
                                  className={`rounded-[16px] px-3 py-2 text-[12px] font-medium cursor-pointer ${
                                    (order.staffStatus || (order.paymentState === "Paid" ? "Paid" : "Charged to tab")) === s
                                      ? "bg-primary text-primary-foreground pointer-events-none"
                                      : "text-[#28293D] data-highlighted:bg-[#F5F0EA]"
                                  }`}
                                >
                                  {t(s)}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <DropdownMenu onOpenChange={onStatusMenuOpenChange}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="group/status h-6 border-transparent px-0 ring-0 hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 aria-expanded:bg-transparent aria-expanded:text-inherit data-[state=open]:bg-transparent cursor-pointer transition-transform duration-150 active:scale-95"
                              >
                                <OrdersStatusBadge status={order.status} />
                                <ChevronDown className="ml-2 size-4 text-[#000000] transition-transform duration-200 ease-out group-data-[state=open]/status:rotate-180" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="z-70 w-px rounded-[16px] p-2 ring-0"
                            >
                              {availableStatuses.map((status) => (
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
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-[11px] font-medium leading-tight text-[#23252A]" dir="ltr">
                      <span className="whitespace-nowrap">{order.date},</span>
                      <br />
                      <span>{order.time}</span>
                    </TableCell>

                    {!hideDriver && (
                      <TableCell className="text-center">
                        <DriverCell
                          orderId={order.id}
                          driver={order.driver}
                          onAssign={(driverName, updatedOrderData) =>
                            onAssignDriver(order.id, driverName, updatedOrderData)
                          }
                          onOpenChange={onStatusMenuOpenChange}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                  {!isLast && (
                    <TableRow className="h-0 hover:bg-transparent data-[state=selected]:bg-transparent">
                      <TableCell colSpan={hideDriver ? 8 : 9} className="p-0">
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

interface ApiDriver {
  _id: string;
  name: string;
  phone: string;
  status: string;
  isActive: boolean;
  vehicleType?: string;
  zones?: string[];
}

interface DriverCellProps {
  orderId: string;
  driver?: string;
  onAssign: (driverName: string, updatedOrderData?: any) => void;
  onOpenChange?: (open: boolean) => void;
}

const DriverCell = ({ orderId, driver, onAssign, onOpenChange }: DriverCellProps) => {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchDrivers = async () => {
    if (hasFetched) return;
    setIsLoading(true);
    try {
      const response = await api.get("/logistics/drivers");
      const data = response.data;
      setDrivers(data.drivers || []);
      setHasFetched(true);
    } catch {
      showErrorToast(t("Failed to load drivers"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (selectedDriver: ApiDriver) => {
    setIsDispatching(true);
    try {
      const response = await api.post("/logistics/dispatch", {
        driverId: selectedDriver._id,
        orderId,
      });
      const resData = response.data;
      showSuccessToast(t("Driver dispatched successfully"));
      onAssign(selectedDriver.name, resData?.order || resData);
    } catch {
      showErrorToast(t("Failed to dispatch driver"));
    } finally {
      setIsDispatching(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchDrivers();
    }
    onOpenChange?.(open);
  };

  const availableDrivers = drivers.filter(
    (d) => d.status === "active" || d.status === "busy"
  );

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        {driver ? (
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-full bg-[#E5E5E5] px-4 text-[13px] font-semibold text-[#23252A] border border-[#CCCCCC] transition-all duration-200 hover:bg-[#DCDCDC] active:scale-95"
          >
            {driver}
          </button>
        ) : (
          <button
            type="button"
            className="group/rider inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#7E00D7] bg-[#F3E9FA] px-3.5 text-[13px] font-semibold text-[#9524E4] hover:bg-[#EBD8F7] transition-all duration-200 hover:shadow-2xs active:scale-95"
          >
            <span>{t("Rider")}</span>
            <ChevronDown className="size-3.5 text-[#9524E4] transition-transform duration-200 ease-out group-hover/rider:translate-y-0.5" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-70 w-40 rounded-[16px] p-2 ring-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : availableDrivers.length === 0 ? (
          <div className="px-3 py-2 text-[12px] text-[#8B8B8B] text-center">
            {t("No drivers available")}
          </div>
        ) : (
          availableDrivers.map((d) => (
            <DropdownMenuItem
              key={d._id}
              disabled={isDispatching}
              onSelect={() => handleSelect(d)}
              className={`rounded-[12px] px-3 py-2 text-[12px] font-medium cursor-pointer ${
                driver === d.name
                  ? "bg-primary text-primary-foreground pointer-events-none"
                  : "text-[#28293D] data-highlighted:bg-[#F5F0EA]"
              }`}
            >
              {d.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrdersTable;

