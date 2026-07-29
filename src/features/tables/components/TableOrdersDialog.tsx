import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import OrdersStatusBadge from "@/features/orders/components/OrdersStatusBadge";
import { getOrders } from "@/features/orders/api/ordersApi";
import { mapOrders } from "@/features/orders/utils/orderMappers";
import type { Order } from "@/features/orders/types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Table } from "../store/tableTypes";

const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface TableOrdersDialogProps {
  table: Table | null;
  onOpenChange: (open: boolean) => void;
}

const TableOrdersDialog = ({ table, onOpenChange }: TableOrdersDialogProps) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!table) return;
    setIsLoading(true);
    getOrders({ tableNumber: table.number })
      .then((res) => setOrders(mapOrders(res.data ?? [])))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [table]);

  return (
    <Dialog open={!!table} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[16px] sm:max-w-140">
        <DialogTitle>
          {t("Order history")} — {t("Table")} {table?.number}
        </DialogTitle>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No orders for this table yet.")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-[12px] border border-[#E5E5E5] px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold text-[#28293D]">
                    #{order.orderId || order.id}
                  </span>
                  <span className="text-[12px] text-[#8B8B8B]">
                    {order.date} · {order.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-[#28293D]">
                    {formatCurrency(order.total)}
                  </span>
                  <OrdersStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableOrdersDialog;
