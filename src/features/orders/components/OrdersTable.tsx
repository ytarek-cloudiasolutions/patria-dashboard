import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Eye, ChevronDown } from "lucide-react";
import OrdersStatusBadge from "./OrdersStatusBadge";
import OrdersFilters from "./OrdersFilters";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { MOCK_ORDERS, ORDER_STATUS_OPTIONS } from "../data";
import type { Order, OrderStatus, OrderStatusFilter } from "../types";

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<OrderStatusFilter>("All Categories");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.location.toLowerCase().includes(normalizedSearch) ||
        order.id.toString().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        order.status === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [orders, searchValue, selectedCategory]);

  const updateStatus = (orderId: number, status: OrderStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );

    setSelectedOrder((previous) =>
      previous && previous.id === orderId ? { ...previous, status } : previous,
    );
  };

  return (
    <>
      <OrdersFilters
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchValue}
        onCategoryChange={setSelectedCategory}
        onCategoryMenuOpenChange={setIsCategoryMenuOpen}
      />

      {(isStatusMenuOpen || isCategoryMenuOpen) && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/15" />
      )}

      <Table>
        <colgroup>
          <col style={{ width: "55px" }} />
          <col style={{ width: "146.5px" }} />
          <col style={{ width: "146.5px" }} />
          <col style={{ width: "146.5px" }} />
          <col style={{ width: "146.5px" }} />
          <col style={{ width: "146.5px" }} />
          <col style={{ width: "146.5px" }} />
        </colgroup>
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="px-4 text-[12px] font-semibold text-[#646B80]">
              Order ID
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              Customer
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              Date
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              Location
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              Total
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              Status
            </TableHead>
            <TableHead className="pr-4 text-center text-[12px] font-semibold text-[#646B80]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:hover]:bg-white">
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="px-4 py-10 text-center text-[14px] text-[#8B8B8B]"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id} className="h-13">
                <TableCell className="px-4 text-28293D-14-semibold ">
                  #{order.id}
                </TableCell>

                <TableCell className="min-w-40">
                  <p className="text-333333-14-semibold">
                    {order.customerName}
                  </p>
                  <p className="text-8B8B8B-12-medium">{order.customerPhone}</p>
                </TableCell>

                <TableCell className="text-595959-14-medium">
                  {order.date}
                </TableCell>
                <TableCell className="text-28293D-14-medium">
                  {order.location}
                </TableCell>
                <TableCell className="text-28293D-14-medium">
                  <span className="text-28293D-14-normal">EGP</span>{" "}
                  {order.total.toFixed(2)}
                </TableCell>

                <TableCell>
                  <DropdownMenu onOpenChange={setIsStatusMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-7 rounded-[6px] px-0 text-left hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                      >
                        <OrdersStatusBadge status={order.status} />
                        <ChevronDown className="ml-1 size-4.5 text-[#000000] " />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="z-70 w-[145.67px] rounded-[16px] p-2 ring-0 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          className={
                            order.status === status
                              ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                              : undefined
                          }
                          onSelect={() => updateStatus(order.id, status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="pr-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#000000] cursor-pointer hover:bg-transparent"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="size-4.5 " />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <OrderDetailsDialog
        open={selectedOrder !== null}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
        onUpdateStatus={updateStatus}
      />
    </>
  );
};

export default OrdersTable;
