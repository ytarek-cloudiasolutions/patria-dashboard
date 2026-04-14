import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { OrderStatus } from "../types";

interface OrderStatusDropdownProps {
  status: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}

const statuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const OrderStatusDropdown = ({
  status,
  onStatusChange,
}: OrderStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFF8E6] text-[#F9A825]";
      case "Preparing":
        return "bg-[#F5F0EA] text-[#6B5E4B]";
      case "Delivered":
        return "bg-[#EDF8F0] text-[#059B5A]";
      case "Cancelled":
        return "bg-[#FFF0F0] text-[#C90000]";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // const getStatusBgColor = (status: OrderStatus) => {
  //   switch (status) {
  //     case "Pending":
  //       return "#8B7500";
  //     case "Preparing":
  //       return "#6B5E4B";
  //     case "Delivered":
  //       return "#059B5A";
  //     case "Cancelled":
  //       return "#C90000";
  //     default:
  //       return "#666";
  //   }
  // };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between"
        style={{ width: "109.5px" }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3 py-1 rounded-[30px] text-[13px] font-semibold ${getStatusColor(
            status
          )}`}
        >
          {status}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 transition-colors shrink-0"
          style={{
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 py-2 px-2 flex flex-col"
          style={{ width: "145.67px" }}
        >
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onStatusChange(s);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 font-medium text-[12px] transition-all rounded-full mb-1 last:mb-0 ${
                s === status ? "text-white" : "text-gray-900 hover:bg-gray-100"
              }`}
              style={s === status ? { backgroundColor: "#8F6900" } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusDropdown;
