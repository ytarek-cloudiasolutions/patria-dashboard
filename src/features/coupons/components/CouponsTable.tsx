import { useState } from "react";
import { Copy, SquarePen, Trash2 } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Coupon } from "../types";

interface CouponsTableProps {
  coupons: Coupon[];
  onStatusChange?: (couponId: number, newStatus: boolean) => void;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (couponId: number) => void;
}

const formatDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const startDay = start.getDate();
  const startMonth = start.toLocaleString("en-US", { month: "short" });
  const endDay = end.getDate();
  const endMonth = end.toLocaleString("en-US", { month: "short" });
  const endYear = end.getFullYear();
  return `${startDay} ${startMonth} → ${endDay} ${endMonth} ${endYear}`;
};

const CouponsTable = ({
  coupons,
  onStatusChange,
  onEdit,
  onDelete,
}: CouponsTableProps) => {
  const { t } = useTranslation();
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleConfirmDelete = () => {
    if (deletingCoupon) {
      onDelete?.(deletingCoupon.id);
      setDeletingCoupon(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-6 py-4 text-start">{t("CODE")}</TableHead>
            <TableHead className="text-start">{t("DISCOUNT TYPE")}</TableHead>
            <TableHead className="text-start">{t("DISCOUNT VALUE")}</TableHead>
            <TableHead className="text-start">{t("MINIMUM ORDER FEE")}</TableHead>
            <TableHead className="text-start">{t("NO. OF USAGE")}</TableHead>
            <TableHead className="text-start">{t("DURATION")}</TableHead>
            <TableHead className="text-end pe-6">{t("ACTIONS")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-12 text-center text-[14px] text-[#8B8B8B]"
              >
                {t("No coupons found.")}
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id} className="transition-colors duration-150 hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[#28293D] tracking-wide">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code, coupon.id)}
                      className="group/copy cursor-pointer text-[#8B8B8B] transition-colors duration-150 hover:text-[#28293D] active:scale-90"
                      title="Copy code"
                    >
                      <Copy
                        className={`size-3.5 transition-transform duration-200 ${
                          copiedId === coupon.id ? "scale-125 text-primary" : "group-hover/copy:scale-110"
                        }`}
                      />
                    </button>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]">
                    {coupon.discountType === "percentage"
                      ? t("Percentage (%)")
                      : t("Fixed Price (EGP)")}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] font-medium text-[#28293D]">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `EGP ${coupon.discountValue.toFixed(2)}`}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]">
                    {coupon.minOrderAmount > 0
                      ? `EGP ${coupon.minOrderAmount.toFixed(2)}`
                      : "-"}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]">
                    {coupon.usedCount} /{" "}
                    {coupon.usageLimit === 0 ? "∞" : coupon.usageLimit}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]" dir="ltr">
                    {formatDuration(coupon.startDate, coupon.endDate)}
                  </span>
                </TableCell>

                <TableCell className="pe-6">
                  <div className="flex items-center justify-end gap-4">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={(val) =>
                        onStatusChange?.(coupon.id, val)
                      }
                      className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33] transition-all duration-200 active:scale-95"
                    />
                    <button
                      onClick={() => onEdit?.(coupon)}
                      aria-label={`Edit ${coupon.code}`}
                      className="group/edit cursor-pointer transition-transform duration-150 active:scale-90"
                    >
                      <SquarePen className="size-4.5 text-[#000000] transition-transform duration-150 group-hover/edit:scale-115" />
                    </button>
                    <button
                      onClick={() => setDeletingCoupon(coupon)}
                      aria-label={`Delete ${coupon.code}`}
                      className="group/del cursor-pointer transition-transform duration-150 active:scale-90"
                    >
                      <Trash2 className="size-4.5 text-[#C90000] transition-transform duration-150 group-hover/del:scale-115" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteDialog
        open={!!deletingCoupon}
        onOpenChange={(open) => !open && setDeletingCoupon(null)}
        data={{ item: deletingCoupon?.code ?? "", type: "coupon" }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CouponsTable;
