import { useEffect, useState } from "react";
import { Ban, Mail, Tablet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import userApi from "../api/userApi";
import type { AppUser, AppUserOrder, AppUserOrderStatus } from "../types";

interface AppUserDetailsDialogProps {
  user: AppUser | null;
  onOpenChange: (open: boolean) => void;
  onBlock: (user: AppUser) => void;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const ORDER_STATUS_STYLES: Record<AppUserOrderStatus, string> = {
  Pending: "border-[#C7861E] bg-[rgba(254,154,0,0.1)] text-[#C7861E]",
  Preparing: "border-[#C7861E] bg-[rgba(254,154,0,0.1)] text-[#C7861E]",
  Confirmed: "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  "On The Way": "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  Delivered: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  Cancelled: "border-[#C90000] bg-[#FFF0F0] text-[#C90000]",
};

const toOrderStatus = (raw: string): AppUserOrderStatus => {
  switch (raw) {
    case "pending": return "Pending";
    case "preparing": return "Preparing";
    case "confirmed": return "Confirmed";
    case "ready": return "On The Way";
    case "served":
    case "completed":
    case "delivered": return "Delivered";
    case "cancelled":
    case "canceled": return "Cancelled";
    default: return "Pending";
  }
};

const AppUserDetailsDialog = ({
  user,
  onOpenChange,
  onBlock,
}: AppUserDetailsDialogProps) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<AppUserOrder[]>([]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    userApi.getOrdersByCustomer(user.id).then((raw) => {
      if (cancelled) return;
      setOrders(
        raw.map((o) => {
          const created = new Date(o.createdAt);
          return {
            id: o.orderId || o._id,
            date: created.toLocaleDateString(),
            time: created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            products: (o.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0),
            total: o.total || 0,
            status: toOrderStatus(o.status),
          };
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  const isActive = user.status === "Active";

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-0 ring-0 sm:max-w-174"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-6 pt-6 sm:px-6 sm:pt-6">
            <div className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[16.6px] font-bold text-white">
              {user.name.trim().charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold tracking-[0.24px] text-[#595959]">
                {t("CUSTOMER INFORMATION")}
              </p>
              <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
                {user.name}
              </DialogTitle>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Contact */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22px] text-[#595959]">
                  {t("EMAIL ADDRESS")}
                </p>
                <p className="flex items-center gap-2 text-[14px] font-medium text-black">
                  <Mail className="size-4.5 text-black" />
                  {user.email}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22px] text-[#595959]">
                  {t("PHONE NUMBER")}
                </p>
                <p className="flex items-center gap-2 text-[14px] font-medium text-black" dir="ltr">
                  <Tablet className="size-4.5 text-black" />
                  {user.phone}
                </p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex h-[115px] flex-col items-center justify-center rounded-[16px] border border-[#8F6900] bg-[#F8F8F8] p-6 text-center">
                <p className="text-[10px] font-semibold tracking-[0.20px] text-[#8F6900]">
                  {t("Total orders")}
                </p>
                <p className="mt-2 text-[18px] font-semibold tracking-[0.36px] text-[#8F6900]">
                  {user.totalOrders}
                </p>
              </div>
              <div className="flex h-[115px] flex-col items-center justify-center rounded-[16px] border border-[#003BBE] bg-[#EDF4FB] p-6 text-center">
                <p className="text-[10px] font-semibold tracking-[0.20px] text-[#3574FF]">
                  {t("Purchases value")}
                </p>
                <p className="mt-2 text-[18px] font-semibold tracking-[0.36px] text-[#3574FF]" dir="ltr">
                  {formatEgp(user.purchasesValue)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-[115px] flex-col items-center justify-center rounded-[16px] border p-6 text-center",
                  isActive
                    ? "border-[#059B5A] bg-[#E2F4ED]"
                    : "border-[#C90000] bg-[#FFF0F0]",
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-semibold tracking-[0.20px]",
                    isActive ? "text-[#059B5A]" : "text-[#C90000]",
                  )}
                >
                  {t("Status")}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[18px] font-semibold tracking-[0.36px]",
                    isActive ? "text-[#059B5A]" : "text-[#C90000]",
                  )}
                >
                  {t(user.status)}
                </p>
              </div>
            </div>

            {/* Orders history */}
            <div className="mt-8 overflow-hidden rounded-[16px] border border-[#E5E5E5]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F0EA]">
                    <TableHead className="ps-6 py-3 text-start text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
                      {t("Order No.")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
                      {t("Date")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
                      {t("Products")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
                      {t("Total")}
                    </TableHead>
                    <TableHead className="pe-6 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
                      {t("Status")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-none hover:bg-[#FAFAF7]">
                      <TableCell className="ps-6 py-3 text-[12px] font-bold text-[#333333]">
                        {order.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-[14px] font-medium text-[#595959]">
                        {order.date}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-[14px] font-medium text-black">
                        {order.products}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-[14px] font-semibold text-black" dir="ltr">
                        {formatEgp(order.total)}
                      </TableCell>
                      <TableCell className="pe-6 py-3">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-[30px] border px-3 py-1 text-[11px] font-semibold tracking-[0.22px]",
                              ORDER_STATUS_STYLES[order.status],
                            )}
                          >
                            {t(order.status)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-[13px] text-[#8B8B8B]"
                      >
                        {t("No orders found.")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t border-[#CACBD4] bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-14 cursor-pointer rounded-[5px] border border-[#8F6900] px-7.5 text-[16px] font-semibold text-[#8F6900] hover:bg-[#FBF6EE] hover:text-[#8F6900]"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => onBlock(user)}
              className="flex h-14 cursor-pointer items-center gap-3 rounded-[5px] bg-[#C90000] px-7.5 text-[16px] font-semibold text-white hover:bg-[#C90000]/90"
            >
              <Ban className="size-4.5 text-white" />
              {isActive ? t("Block Customer") : t("Unblock Customer")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppUserDetailsDialog;
