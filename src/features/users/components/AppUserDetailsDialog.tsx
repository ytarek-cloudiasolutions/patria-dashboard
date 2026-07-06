import { Ban, Mail, Phone } from "lucide-react";
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
import type { AppUser, AppUserOrderStatus } from "../types";

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
  Pending: "border-[#B58A00] text-[#B58A00]",
  Confirmed: "border-[#3357B5] text-[#3357B5]",
  Delivered: "border-[#059B5A] text-[#059B5A]",
  Cancelled: "border-[#C90000] text-[#C90000]",
};

const AppUserDetailsDialog = ({
  user,
  onOpenChange,
  onBlock,
}: AppUserDetailsDialogProps) => {
  const { t } = useTranslation();
  if (!user) return null;

  const isActive = user.status === "Active";

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-semibold text-white">
              {user.name.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                {t("Customer Information")}
              </p>
              <DialogTitle className="text-[20px] font-bold text-[#28293D]">
                {user.name}
              </DialogTitle>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {/* Contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Email Address")}
                </p>
                <p className="flex items-center gap-1.5 text-[13px] text-[#28293D]">
                  <Mail className="size-4 text-[#8B8B8B]" />
                  {user.email}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Phone Number")}
                </p>
                <p className="flex items-center gap-1.5 text-[13px] text-[#28293D]" dir="ltr">
                  <Phone className="size-4 text-[#8B8B8B]" />
                  {user.phone}
                </p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[#C7861E]/50 bg-[#FFF9EF] px-4 py-3 text-center">
                <p className="text-[11px] font-semibold text-[#8B8B8B]">
                  {t("Total orders")}
                </p>
                <p className="mt-1 text-[18px] font-bold text-[#28293D]">
                  {user.totalOrders}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#3357B5]/40 bg-[#EEF3FF] px-4 py-3 text-center">
                <p className="text-[11px] font-semibold text-[#8B8B8B]">
                  {t("Purchases value")}
                </p>
                <p className="mt-1 text-[18px] font-bold text-[#3357B5]" dir="ltr">
                  {formatEgp(user.purchasesValue)}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-[12px] border px-4 py-3 text-center",
                  isActive
                    ? "border-[#059B5A]/40 bg-[#E9F8F1]"
                    : "border-[#C90000]/40 bg-[#FDECEC]",
                )}
              >
                <p className="text-[11px] font-semibold text-[#8B8B8B]">
                  {t("Status")}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[18px] font-bold",
                    isActive ? "text-[#059B5A]" : "text-[#C90000]",
                  )}
                >
                  {t(user.status)}
                </p>
              </div>
            </div>

            {/* Orders history */}
            <div className="mt-5 overflow-hidden rounded-[12px] border border-[#E5E5E5]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="ps-4 py-3 text-start">
                      {t("Order No.")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-start">
                      {t("Date")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center">
                      {t("Products")}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-start">
                      {t("Total")}
                    </TableHead>
                    <TableHead className="pe-4 py-3 text-center">
                      {t("Status")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="ps-4 py-3 text-[12px] font-bold text-[#28293D]">
                        {order.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[12px] text-[#595959]">
                        <p>{order.date}</p>
                        <p className="text-[#8B8B8B]">{order.time}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-[13px] text-[#28293D]">
                        {order.products}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] font-semibold text-[#28293D]" dir="ltr">
                        {formatEgp(order.total)}
                      </TableCell>
                      <TableCell className="pe-4 py-3">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "inline-flex h-6 items-center rounded-full border bg-white px-3 text-[11px] font-semibold",
                              ORDER_STATUS_STYLES[order.status],
                            )}
                          >
                            {t(order.status)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {user.orders.length === 0 && (
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
          <div className="flex justify-end gap-3 border-t border-[#E1E1E1] bg-white px-5 py-4 sm:px-7">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-[8px] border-primary px-6 text-[13px] font-semibold text-primary hover:bg-[#FBF6EE] hover:text-primary"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => onBlock(user)}
              className="flex h-12 items-center gap-2 rounded-[8px] bg-[#C90000] px-6 text-[13px] font-semibold text-white hover:bg-[#C90000]/90"
            >
              <Ban className="size-4" />
              {isActive ? t("Block Customer") : t("Unblock Customer")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppUserDetailsDialog;
