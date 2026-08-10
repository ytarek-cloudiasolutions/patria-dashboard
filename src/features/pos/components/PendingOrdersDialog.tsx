import { useEffect, useState } from "react";
import { Clock3, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PendingOrder } from "../types";
import { formatEgp } from "../utils";
import { api } from "@/config/api";

type PendingOrdersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOrder: (order: PendingOrder) => void;
  onNewOrder: () => void;
};

const PendingOrdersDialog = ({
  open,
  onOpenChange,
  onSelectOrder,
  onNewOrder,
}: PendingOrdersDialogProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setLoading(true);
    api
      .get("/orders", {
        params: { source: "pos", status: "pending", type: "dine_in", limit: 50 },
      })
      .then((res) => {
        const raw: any[] = res.data?.data ?? res.data?.orders ?? [];
        const mapped: PendingOrder[] = raw.map((o) => ({
          id: o._id,
          table: o.address || o.customer?.address || `Table ${o.tableNumber ?? "?"}`,
          itemCount: o.items?.length ?? 0,
          time: o.createdAt
            ? new Date(o.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "--",
          total: o.total ?? 0,
          items: (o.items || []).map((item: any) => ({
            productId: item.productId?._id || item.product?._id || String(item.productId || ""),
            name: item.productId?.name || item.product?.name || item.name || "Unknown",
            qty: item.quantity || 1,
            unitPrice: item.price || item.productId?.price || 0,
          })),
        }));
        setOrders(mapped);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [open]);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? orders.filter((order) => order.table.toLowerCase().includes(query))
    : orders;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[696px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Pending orders")} ({t("Dine-in")})
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute start-3.5 size-5 text-[#8B8B8B]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("Search table...")}
              className="h-[50px] w-full rounded-[8px] border border-[#CACBD4] bg-white ps-11 pe-3.5 text-[16px] text-[#333333] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
            />
          </div>

          <div className="max-h-[480px] space-y-4 overflow-y-auto pe-1">
            {loading ? (
              <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
                {t("Loading...")}
              </p>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
                {t("No pending orders found")}
              </p>
            ) : (
              filtered.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className="flex w-full flex-col gap-3 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] px-6 py-4 text-start transition-colors hover:border-[#8F6900] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold tracking-[0.28px] text-black">
                      {order.table}
                    </p>
                    <span className="text-[16px] font-medium tracking-[0.32px] text-[#059B5A]">
                      EGP{" "}
                      <span className="font-bold">
                        {order.total.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="font-semibold tracking-[0.24px] text-[#595959]">
                      {order.itemCount} {t("Items")}
                    </span>
                    <span className="text-[#8B8B8B]">·</span>
                    <span className="flex items-center gap-1.5 font-medium tracking-[0.24px] text-[#595959]">
                      <Clock3 className="size-4 text-black" />
                      {order.time}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Separator Line & Footer */}
        <div className="w-full border-t border-[#CACBD4] pt-4">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer"
              onClick={onNewOrder}
            >
              {t("New Order")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingOrdersDialog;
