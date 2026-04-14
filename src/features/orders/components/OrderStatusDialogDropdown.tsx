import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { OrderStatus } from "../types";

interface OrderStatusDialogDropdownProps {
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

const OrderStatusDialogDropdown = ({
  status,
  onStatusChange,
}: OrderStatusDialogDropdownProps) => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between px-4 py-2.5 h-11 border border-gray-300 rounded-lg bg-white hover:bg-white transition-colors font-medium text-gray-900"
        style={{ width: "240px" }}
      >
        {status}
        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
          style={{ width: "240px" }}
        >
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onStatusChange(s);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                s === status
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusDialogDropdown;
