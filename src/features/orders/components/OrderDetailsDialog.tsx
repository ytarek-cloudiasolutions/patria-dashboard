import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import OrdersStatusBadge from "./OrdersStatusBadge";
import type { Order, OrderStatus } from "../types";
import { ORDER_STATUS_OPTIONS } from "../data";
import { ChevronDown, UserRound, MapPin, CreditCard } from "lucide-react";

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

const OrderDetailsDialog = ({
  open,
  order,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailsDialogProps) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-174 rounded-[12px] ring-0 p-0 sm:max-w-174"
      >
        <div className="relative p-6">
          {isStatusMenuOpen && (
            <div className="pointer-events-none absolute inset-0 z-60 rounded-[12px] bg-black/15" />
          )}

          <div className="mb-8 flex items-center gap-3">
            <DialogTitle className="text-[#333333] text-[24px] font-semibold">
              Order #{order.id}
            </DialogTitle>
            <OrdersStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <Card className="bg-[#f1f1ef] ring-0">
              <CardContent>
                <p className="mb-4 flex items-center gap-1 text-28293D-14-semibold uppercase">
                  <UserRound className="size-4.5" />
                  Customer details
                </p>
                <p className="text-333333-16-semibold mb-1">
                  {order.customerName}
                </p>
                <p className="text-8B8B8B-12-normal mb-2">
                  {order.customerPhone}
                </p>
                <p className="text-23252A-12-normal">{order.address}</p>
              </CardContent>
            </Card>

            <Card className="row-span-3 bg-[#f1f1ef] ring-0">
              <CardContent className="flex h-full flex-col">
                <p className="mb-4 flex items-center gap-1 text-28293D-14-semibold uppercase">
                  <UserRound className="size-4.5" />
                  Customer details
                </p>
                <div>
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-2.5 py-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-10 rounded-[8px] object-cover"
                        />
                        <span className="text-28293D-14-semibold">
                          {item.name}
                        </span>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="bg-[#CACBD4] my-4" />
                      )}
                    </div>
                  ))}
                </div>
                <Separator className="my-11.25 bg-[#CACBD4]" />
                <div className="mt-auto flex items-center justify-between pt-4 text-[14px]">
                  <span className="text-333333-16-semibold ">Total</span>
                  <span className="text-333333-16-bold ">
                    <span className="text-333333-16-normal">EGP </span>
                    {order.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f1f1ef] ring-0">
              <CardContent>
                <p className="mb-4 flex items-center gap-1 text-28293D-14-semibold uppercase">
                  <MapPin className="size-4.5" />
                  Delivery zone
                </p>
                <p className="text-28293D-14-semibold">{order.deliveryZone}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#f1f1ef] ring-0">
              <CardContent>
                <p className="mb-4 flex items-center gap-1 text-28293D-14-semibold uppercase">
                  <CreditCard className="size-4.5" />
                  Customer details
                </p>
                <p className="text-28293D-14-semibold">{order.paymentMethod}</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6 bg-[#CACBD4]" />

          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-595959-14-medium">Update Status:</p>
            <DropdownMenu onOpenChange={setIsStatusMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-between rounded-[8px] border-[#E5E5E5] bg-white px-4.5 py-3 text-[#000000] text-[14px] font-normal cursor-pointer focus-visible:border-[#E5E5E5] focus-visible:ring-0 md:w-62.5"
                >
                  {order.status}
                  <ChevronDown className="size-6 text-[#000000]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-70  rounded-[16px] p-2 ring-0 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className={
                      order.status === status
                        ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                        : undefined
                    }
                    onSelect={() => onUpdateStatus(order.id, status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator className="my-6 bg-[#CACBD4]" />

          <div className="flex justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-7.5 py-4 h-14 border-primary text-primary text-[16px] cursor-pointer font-semibold rounded-[5px] hover:text-primary hover:bg-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
