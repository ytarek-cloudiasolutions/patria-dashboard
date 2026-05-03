import { Printer } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import OrdersStatusBadge from "./OrdersStatusBadge";
import type { Order } from "../types";

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const OrderDetailsDialog = ({
  open,
  order,
  onOpenChange,
}: OrderDetailsDialogProps) => {
  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-3rem)] max-w-140 overflow-y-auto rounded-[8px] bg-white p-0 ring-0 sm:max-w-174"
      >
        <div className="p-6">
          <div className="mb-7 flex items-center gap-3">
            <DialogTitle className="text-[24px] font-semibold text-[#333333]">
              Order #{order.id.split("-").at(-1)}
            </DialogTitle>
            <OrdersStatusBadge status={order.status} />
          </div>

          <section className="rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
            <div className="mb-7 flex items-start justify-between">
              <p className="text-[10px] font-bold uppercase text-[#595959]">
                Customer Details
              </p>
              <p className="text-[10px] font-bold uppercase text-[#595959]">
                Date
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold text-[#333333]">
                  {order.customerName}
                </p>
                <p className="mt-1 text-[12px] text-[#8B8B8B]">
                  {order.customerPhone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-[#28293D]">
                  {order.date}
                </p>
                <p className="mt-1 text-[12px] text-[#8B8B8B]">{order.time}</p>
                <div className="mt-2">
                  <OrdersStatusBadge status={order.status} />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
            <p className="mb-4 text-[10px] font-bold uppercase text-[#595959]">
              Orders
            </p>
            <div className="space-y-3">
              {order.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex min-h-10 items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-white px-3"
                >
                  <span className="text-[14px] font-medium text-[#333333]">
                    {item.quantity}X {item.name}
                  </span>
                  <span className="text-[12px] font-semibold text-[#28293D]">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[14px] text-[#333333]">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[14px] text-[#333333]">
                <span>Delivery Fees:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <Separator className="bg-[#D9D9D9]" />
              <div className="flex items-center justify-between text-[16px] font-semibold text-[#111111]">
                <span>Total:</span>
                <span>{formatCurrency(order.total + order.deliveryFee)}</span>
              </div>
              <span className="inline-flex h-6 items-center rounded-full border border-[#3574FF] bg-[#EDF4FB] px-3 text-[12px] font-semibold text-[#3574FF]">
                {order.paymentMethod}
              </span>
            </div>
          </section>

          <Separator className="my-7 bg-[#D9D9D9]" />

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-[5px] border-primary bg-white text-[14px] font-semibold text-primary hover:bg-white hover:text-primary"
            >
              <Printer className="size-4" />
              Print Customer Receipt
            </Button>
            <Button
              type="button"
              className="h-12 rounded-[5px] bg-primary text-[14px] font-semibold text-white hover:bg-primary"
            >
              <Printer className="size-4" />
              Print Kitchen Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
