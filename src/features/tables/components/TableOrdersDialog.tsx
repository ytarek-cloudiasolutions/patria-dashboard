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

const SECTION_DISPLAY: Record<string, string> = {
  main_hall: "Main Hall",
  terrace: "Terrace",
  vip: "VIP",
  counter: "Counter",
};

const formatTableTitle = (table: Table | null, t: (key: string) => string) => {
  if (!table) return "";
  const paddedNumber = String(table.number).padStart(2, "0");
  const section = t(SECTION_DISPLAY[table.section] ?? table.section ?? "");
  return section ? `${t("Table")} ${paddedNumber} - ${section}` : `${t("Table")} ${paddedNumber}`;
};

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
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[696px] overflow-y-auto rounded-[12px] border border-[#CACBD4] p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[696px]"
      >
        <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
          {formatTableTitle(table, t)}
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

        <div className="mt-4 flex flex-col gap-6">
          <div className="w-full border-t border-[#CACBD4]" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-[56px] cursor-pointer items-center justify-center gap-[12px] rounded-[5px] border border-[#8F6900] px-[30px] py-[16px] text-[16px] font-semibold leading-[24px] text-[#8F6900] hover:bg-[#8F6900]/5 transition-colors"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableOrdersDialog;
