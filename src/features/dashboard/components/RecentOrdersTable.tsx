import { Clock } from "lucide-react";
import type { RecentOrderProps } from "../types";

const RecentOrdersTable = () => {
  const orders: RecentOrderProps[] = [
    {
      id: 1,
      customerName: "Sara Al-Mansouri",
      date: "3/15/2026",
      time: "10:53:52 AM",
      amount: "240.00",
      status: "Confirmed",
    },
    {
      id: 2,
      customerName: "Ali Hassan",
      date: "3/15/2026",
      time: "11:05:30 AM",
      amount: "240.00",
      status: "Preparing",
    },
    {
      id: 3,
      customerName: "Nadia Ibrahim",
      date: "3/15/2026",
      time: "11:15:45 AM",
      amount: "240.00",
      status: "Pending",
    },
    {
      id: 4,
      customerName: "Omar Khaled",
      date: "3/15/2026",
      time: "11:30:12 AM",
      amount: "240.00",
      status: "Delivered",
    },
    {
      id: 5,
      customerName: "Layla Farouk",
      date: "3/15/2026",
      time: "11:45:00 AM",
      amount: "240.00",
      status: "Cancelled",
    },
  ];

  const getStatusColor = (status: RecentOrderProps["status"]) => {
    switch (status) {
      case "Confirmed":
        return "text-[#3574FF]";
      case "Preparing":
        return "text-white";
      case "Pending":
        return "text-[#C7861E]";
      case "Delivered":
        return "text-[#059B5A]";
      case "Cancelled":
        return "text-[#C90000]";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgColor = (status: RecentOrderProps["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#EDF4FB]";
      case "Preparing":
        return "bg-primary";
      case "Pending":
        return "bg-[#FE9A001A]";
      case "Delivered":
        return "bg-[#EDF8F0]";
      case "Cancelled":
        return "bg-[#FFF0F0]";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border-b border-[#CACBD4] pb-4 last:border-b-0"
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-[14px]">
                  <span className="font-semibold">#{order.id}</span>{" "}
                  <span className="font-medium">{order.customerName}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.25 font-medium text-[12px] text-[#595959]">
                <Clock size={12} />
                <span>
                  {order.date}, {order.time}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-[14px] text-[#28293D]">
                <span className="font-medium">EGP</span> {order.amount}
              </p>
              <span
                className={`px-3 py-1 rounded-[30px] font-semibold text-[13px] ${getStatusColor(
                  order.status
                )} ${getStatusBgColor(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrdersTable;
