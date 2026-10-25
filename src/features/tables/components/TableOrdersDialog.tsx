import { Fragment, useEffect, useState } from "react";
import { Loader2, UserRound } from "lucide-react";
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
import { cn } from "@/lib/utils";
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

const formatOrderTimestamp = (order: Order) => {
  if (order.createdAt) {
    const date = new Date(order.createdAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString("en-US");
    }
  }
  return `${order.date}, ${order.time}`;
};

const CREATOR_TONES = {
  info: {
    bg: "bg-[#F1F5F9]",
    border: "border-[#1D4ED8]",
    text: "text-[#3B82F6]",
  },
  warning: {
    bg: "bg-[#FFF7E6]",
    border: "border-[#C7861E]",
    text: "text-[#C7861E]",
  },
  primary: {
    bg: "bg-[#F5F0EA]",
    border: "border-[#8F6900]",
    text: "text-[#8F6900]",
  },
} as const;

const getCreatorBadge = (order: Order) => {
  const role = (order.createdByRole || "").toLowerCase();
  const name = order.createdByName?.trim();
  if (!role && !name) return null;

  if (role === "superadmin" || role === "admin") {
    return {
      label: name || (role === "superadmin" ? "Super Admin" : "Admin"),
      tone: CREATOR_TONES.info,
    };
  }

  if (role === "manager") {
    return { label: name || "Manager", tone: CREATOR_TONES.warning };
  }

  const prefix =
    order.source === "pos" ? "POS" : order.source === "call" ? "Call" : "";
  return {
    label: name ? (prefix ? `${prefix} - ${name}` : name) : prefix || role,
    tone: CREATOR_TONES.primary,
  };
};

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
        className="flex h-[92vh] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[696px] flex-col gap-8 overflow-hidden rounded-[12px] border border-[#CACBD4] p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[696px]"
      >
        <DialogTitle className="shrink-0 text-[24px] font-semibold tracking-[0.48px] text-black">
          {formatTableTitle(table, t)}
        </DialogTitle>

        <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
              {t("No orders for this table yet.")}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const creator = getCreatorBadge(order);

                return (
                  <div
                    key={order.id}
                    className="flex w-full flex-col gap-3 rounded-2xl border border-[#E5E5E5] bg-[#FAFAF7] px-6 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold tracking-tight text-[#28293D]">
                        #{order.orderId || order.id}
                      </span>
                      <div className="flex items-center gap-3">
                        <OrdersStatusBadge
                          status={order.status}
                          className="h-auto w-24 px-3 py-1 text-xs"
                        />
                        <p className="text-base tracking-tight text-[#059B5A]">
                          <span className="font-semibold">EGP</span>{" "}
                          <span className="font-bold">
                            {order.total.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium tracking-tight text-[#595959]">
                        {formatOrderTimestamp(order)}
                      </span>
                      {creator && (
                        <>
                          <span className="size-1 shrink-0 rounded-full bg-[#8B8B8B]" />
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-[30px] border px-2 py-0.5",
                              creator.tone.bg,
                              creator.tone.border,
                              creator.tone.text,
                            )}
                          >
                            <UserRound className="size-3" />
                            <span className="text-xs font-semibold tracking-tight">
                              {creator.label}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    {order.items.length > 0 && (
                      <div className="border-dashed-gold flex w-full flex-col gap-3 bg-[#FAFAF7] p-3">
                        {order.items.map((item, index) => (
                          <Fragment key={`${item.id}-${index}`}>
                            {index > 0 && (
                              <div className="h-px w-full bg-[#CACBD4]" />
                            )}
                            <div className="flex items-center justify-between gap-3">
                              <p className="min-w-0 flex-1 truncate text-sm text-black">
                                <span className="font-medium">
                                  {item.quantity}X{" "}
                                </span>
                                <span className="font-normal">{item.name}</span>
                              </p>
                              <p className="shrink-0 text-xs tracking-tight text-[#595959]">
                                <span className="font-medium">EGP</span>{" "}
                                <span className="font-semibold">
                                  {(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                              </p>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-8">
          <div className="w-full border-t border-[#CACBD4]" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-[56px] cursor-pointer items-center justify-center gap-[12px] rounded-[5px] border border-[#8F6900] px-[30px] py-[16px] text-[16px] font-semibold leading-[24px] text-[#8F6900] transition-colors hover:bg-[#8F6900]/5"
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
