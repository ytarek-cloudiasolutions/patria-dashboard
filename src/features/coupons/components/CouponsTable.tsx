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
  onStatusChange?: (couponId: string, newStatus: boolean) => void;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (couponId: string) => void;
}

const formatExpiry = (expiryDate?: string) => {
  if (!expiryDate) return "No expiry";
  const date = new Date(expiryDate + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `Expires ${day} ${month} ${year}`;
};

const CouponsTable = ({
  coupons,
  onStatusChange,
  onEdit,
  onDelete,
}: CouponsTableProps) => {
  const { t } = useTranslation();
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleConfirmDelete = () => {
    if (deletingCoupon) {
      onDelete?.(deletingCoupon._id);
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
              <TableRow key={coupon._id}>
                <TableCell className="ps-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[#28293D] tracking-wide">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code, coupon._id)}
                      className="cursor-pointer text-[#8B8B8B] hover:text-[#28293D] transition-colors"
                      title="Copy code"
                    >
                      <Copy
                        className={`size-3.5 ${copiedId === coupon._id ? "text-primary" : ""}`}
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
                  <span className="text-[14px] text-[#28293D]">-</span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]">
                    {coupon.currentUses} /{" "}
                    {!coupon.maxUses || coupon.maxUses === 0 ? "∞" : coupon.maxUses}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-[14px] text-[#28293D]" dir="ltr">
                    {formatExpiry(coupon.expiryDate)}
                  </span>
                </TableCell>

                <TableCell className="pe-6">
                  <div className="flex items-center justify-end gap-4">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={(val) =>
                        onStatusChange?.(coupon._id, val)
                      }
                      className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33]"
                    />
                    <button
                      onClick={() => onEdit?.(coupon)}
                      className="cursor-pointer"
                    >
                      <SquarePen className="size-4.5 text-[#000000]" />
                    </button>
                    <button
                      onClick={() => setDeletingCoupon(coupon)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="size-4.5 text-[#C90000]" />
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
