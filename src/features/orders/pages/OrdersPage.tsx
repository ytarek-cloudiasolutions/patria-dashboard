import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import OrdersTable from "../components/OrdersTable";
import StatusFilter from "../components/StatusFilter";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import type { OrderRow, OrderStatus, OrderDetails } from "../types";

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data - replace with API call
  const [orders, setOrders] = useState<OrderRow[]>([
    {
      id: "7",
      customerName: "Layla Ibrahim",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Kafr Abdo",
      total: "EGP 85.20",
      status: "Pending",
    },
    {
      id: "6",
      customerName: "Ahmed El-Sayed",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Semouha",
      total: "EGP 125.20",
      status: "Preparing",
    },
    {
      id: "5",
      customerName: "Omar Khaled",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "New Cairo",
      total: "EGP 1340.67",
      status: "Cancelled",
    },
    {
      id: "4",
      customerName: "Youssef Nabil",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Dokki",
      total: "EGP 110.45",
      status: "Pending",
    },
    {
      id: "3",
      customerName: "Laila Ahmed",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Maadi",
      total: "EGP 720.00",
      status: "Pending",
    },
    {
      id: "2",
      customerName: "Mona El-Sharif",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Zamalek",
      total: "EGP 680.89",
      status: "Pending",
    },
    {
      id: "1",
      customerName: "Dina Samir",
      customerPhone: "+20 122 555 7890",
      date: "Mar 15, 2026",
      location: "Zamalek",
      total: "EGP 180.00",
      status: "Delivered",
    },
  ]);

  // Extended mock data with order details
  const [ordersWithDetails, setOrdersWithDetails] = useState<
    Record<string, OrderDetails>
  >({
    "1": {
      id: "1",
      customerName: "Dina Samir",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Zamalek, Cairo",
      date: "Mar 15, 2026",
      location: "Zamalek",
      total: "EGP 180.00",
      status: "Delivered",
      paymentType: "Credit Card",
      items: [
        {
          id: "item1",
          name: "Kunafa Tiramsu",
          quantity: 1,
          price: "EGP 85.00",
        },
        {
          id: "item2",
          name: "Amber Sobia",
          quantity: 1,
          price: "EGP 95.00",
        },
      ],
    },
    "2": {
      id: "2",
      customerName: "Mona El-Sharif",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Zamalek, Cairo",
      date: "Mar 15, 2026",
      location: "Zamalek",
      total: "EGP 680.89",
      status: "Pending",
      paymentType: "Cash",
      items: [
        {
          id: "item1",
          name: "Premium Pastry Set",
          quantity: 2,
          price: "EGP 150.00",
        },
        {
          id: "item2",
          name: "Fresh Juice",
          quantity: 3,
          price: "EGP 60.89",
        },
      ],
    },
    "3": {
      id: "3",
      customerName: "Laila Ahmed",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Maadi, Cairo",
      date: "Mar 15, 2026",
      location: "Maadi",
      total: "EGP 720.00",
      status: "Pending",
      paymentType: "Credit Card",
      items: [
        {
          id: "item1",
          name: "Deluxe Dessert Box",
          quantity: 2,
          price: "EGP 350.00",
        },
        {
          id: "item2",
          name: "Specialty Coffee",
          quantity: 1,
          price: "EGP 20.00",
        },
      ],
    },
    "4": {
      id: "4",
      customerName: "Youssef Nabil",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Dokki, Cairo",
      date: "Mar 15, 2026",
      location: "Dokki",
      total: "EGP 110.45",
      status: "Pending",
      paymentType: "Cash",
      items: [
        {
          id: "item1",
          name: "Mixed Pastries",
          quantity: 3,
          price: "EGP 35.00",
        },
        {
          id: "item2",
          name: "Fruit Juice",
          quantity: 2,
          price: "EGP 5.45",
        },
      ],
    },
    "5": {
      id: "5",
      customerName: "Omar Khaled",
      customerPhone: "+20 122 555 7890",
      customerLocation: "New Cairo, Cairo",
      date: "Mar 15, 2026",
      location: "New Cairo",
      total: "EGP 1340.67",
      status: "Cancelled",
      paymentType: "Credit Card",
      items: [
        {
          id: "item1",
          name: "Premium Catering Set",
          quantity: 5,
          price: "EGP 250.00",
        },
        {
          id: "item2",
          name: "Special Beverages",
          quantity: 10,
          price: "EGP 34.07",
        },
      ],
    },
    "6": {
      id: "6",
      customerName: "Ahmed El-Sayed",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Semouha, Alexandria",
      date: "Mar 15, 2026",
      location: "Semouha",
      total: "EGP 125.20",
      status: "Preparing",
      paymentType: "Credit Card",
      items: [
        {
          id: "item1",
          name: "Kunafa Tiramsu",
          quantity: 1,
          price: "EGP 85.20",
        },
        {
          id: "item2",
          name: "Sobia",
          quantity: 1,
          price: "EGP 40.00",
        },
      ],
    },
    "7": {
      id: "7",
      customerName: "Layla Ibrahim",
      customerPhone: "+20 122 555 7890",
      customerLocation: "Kafr Abdo, Alexandria",
      date: "Mar 15, 2026",
      location: "Kafr Abdo",
      total: "EGP 85.20",
      status: "Pending",
      paymentType: "Cash",
      items: [
        {
          id: "item1",
          name: "Chocolate Cake Slice",
          quantity: 2,
          price: "EGP 40.00",
        },
        {
          id: "item2",
          name: "Hot Beverage",
          quantity: 1,
          price: "EGP 5.20",
        },
      ],
    },
  });

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by search query
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Update in details too
    setOrdersWithDetails((prev) => ({
      ...prev,
      [orderId]: prev[orderId]
        ? { ...prev[orderId], status: newStatus }
        : prev[orderId],
    }));
  };

  // Handle view details
  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  // Get selected order details
  const selectedOrderDetails = selectedOrderId
    ? ordersWithDetails[selectedOrderId]
    : null;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-[32px]">Orders</h1>
        <p className="font-normal text-[16px] text-gray-600">
          Manage and track customer orders
        </p>
      </div>

      {/* White Container with Search, Filter and Table */}
      <div>
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search by ID or customer name.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 font-normal placeholder:text-[16px]"
            />
          </div>
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        {/* Table */}
        <OrdersTable
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Order Details Dialog */}
      {selectedOrderDetails && (
        <OrderDetailsDialog
          order={selectedOrderDetails}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedOrderId(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default OrdersPage;
