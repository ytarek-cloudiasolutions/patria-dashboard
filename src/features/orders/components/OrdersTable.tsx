import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import OrderStatusDropdown from "./OrderStatusDropdown";
import type { OrderRow, OrderStatus } from "../types";

interface OrdersTableProps {
  orders: OrderRow[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (orderId: string) => void;
}

const OrdersTable = ({
  orders,
  onStatusChange,
  onViewDetails,
}: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[13px]">Order ID</TableHead>
          <TableHead className="font-semibold text-[13px]">Customer</TableHead>
          <TableHead className="font-semibold text-[13px]">Date</TableHead>
          <TableHead className="font-semibold text-[13px]">Location</TableHead>
          <TableHead className="font-semibold text-[13px]">Total</TableHead>
          <TableHead className="font-semibold text-[13px]">Status</TableHead>
          <TableHead className="font-semibold text-[13px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-8">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-semibold text-[14px]">
                #{order.id}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-[14px]">
                    {order.customerName}
                  </p>
                  <p className="text-normal text-[12px]">
                    {order.customerPhone}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium text-[14px]">
                {order.date}
              </TableCell>
              <TableCell className="font-medium text-[14px]">
                {order.location}
              </TableCell>
              <TableCell className="font-medium text-[14px]">
                {order.total}
              </TableCell>
              <TableCell>
                <OrderStatusDropdown
                  status={order.status}
                  onStatusChange={(newStatus) =>
                    onStatusChange(order.id, newStatus)
                  }
                />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onViewDetails(order.id)}
                  className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="View order details"
                >
                  <Eye size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
