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
import { PENDING_ORDERS } from "../data";
import type { PendingOrder } from "../types";
import { formatEgp } from "../utils";

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

  useEffect(() => {
    if (!open) return;
    setSearch("");
  }, [open]);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? PENDING_ORDERS.filter((order) =>
        order.table.toLowerCase().includes(query),
      )
    : PENDING_ORDERS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[540px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[540px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Pending orders")} ({t("Dine-in")})
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-[#8B8B8B]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("Search table...")}
              className="h-11 w-full rounded-[8px] border border-[#E5E2DD] bg-white ps-9 pe-3 text-[13px] text-[#333333] outline-none placeholder:text-[#8B8B8B] focus:border-primary/50"
            />
          </div>

          <div className="mt-4 max-h-[44vh] space-y-2.5 overflow-y-auto pe-1">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#8B8B8B]">
                {t("No pending orders found")}
              </p>
            ) : (
              filtered.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="flex w-full items-center justify-between rounded-[10px] border border-[#EDEBE7] bg-white px-4 py-3 text-start transition-colors hover:border-primary/50 hover:bg-[#FCFBF8]"
                >
                  <div>
                    <p className="text-[13px] font-bold text-[#333333]">
                      {order.table}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8B8B8B]">
                      {order.itemCount} {t("Items")}
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3" />
                        {order.time}
                      </span>
                    </p>
                  </div>
                  <span className="text-[14px] font-bold text-[#00A662]">
                    {formatEgp(order.total)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="h-12 min-w-[150px] rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
            onClick={onNewOrder}
          >
            {t("New Order")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PendingOrdersDialog;
