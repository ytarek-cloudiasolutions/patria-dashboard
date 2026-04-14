import OrderStatusDialogDropdown from "./OrderStatusDialogDropdown";
import type { OrderDetails, OrderStatus } from "../types";

interface OrderDetailsDialogProps {
  order: OrderDetails;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsDialog = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailsDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-3">
          <h2 className="text-[24px] font-semibold ">Order #{order.id}</h2>
          <div
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor:
                order.status === "Pending"
                  ? "#FFF8E6"
                  : order.status === "Preparing"
                  ? "#F5F0EA"
                  : order.status === "Delivered"
                  ? "#EDF8F0"
                  : "#FFF0F0",
              color:
                order.status === "Pending"
                  ? "#F9A825"
                  : order.status === "Preparing"
                  ? "#6B5E4B"
                  : order.status === "Delivered"
                  ? "#059B5A"
                  : "#C90000",
            }}
          >
            {order.status}
          </div>
        </div>

        {/* Dialog Content */}
        <div className="px-6 py-6 space-y-6">
          {/* First Row - Customer Details and Location/Payment in two columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Customer Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>👤</span> CUSTOMER DETAILS
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.customerLocation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📍</span> LOCATION
                </h3>
                <p className="text-sm text-gray-900">{order.location}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💳</span> PAYMENT
                </h3>
                <p className="text-sm text-gray-900">{order.paymentType}</p>
              </div>
            </div>

            {/* Right Column - Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-4">
                ORDER DETAILS
              </h3>
              <div className="space-y-3 mb-24">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-b-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.quantity}x {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-15 border-t border-gray-300 flex justify-between ">
                <span className="text-[16px] font-semibold">Total</span>
                <span className="text-[16px] font-semibold text-gray-900">
                  {order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mx-0" />

          {/* Status Update Section */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Update Status:</span>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <OrderStatusDialogDropdown
                status={order.status}
                onStatusChange={(newStatus: OrderStatus) =>
                  onStatusChange(order.id, newStatus)
                }
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 py-6">
          <div className="border-t border-gray-200" />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-7.5 py-4 border-2 border-primary text-primary font-medium rounded-[5px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsDialog;
