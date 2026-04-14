import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import CouponsOverview from "../components/CouponsOverview";
import CouponsTable from "../components/CouponsTable";
import CreateCouponForm from "../components/CreateCouponForm";
import type { CouponProps } from "../types";

const CouponsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponProps | undefined>();
  const couponsTableRef = useRef<{
    addCoupon: (coupon: CouponProps) => void;
    updateCoupon: (coupon: CouponProps) => void;
  }>(null);

  const handleSaveCoupon = (coupon: CouponProps) => {
    if (editingCoupon) {
      couponsTableRef.current?.updateCoupon(coupon);
      setEditingCoupon(undefined);
    } else {
      couponsTableRef.current?.addCoupon(coupon);
    }
  };

  const handleEditCoupon = (coupon: CouponProps) => {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingCoupon(undefined);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[32px]">Coupons</h1>
          <p className="font-normal text-[16px">
            Customer discount code management and mobile application
          </p>
        </div>
        <Button
          className="px-7.5 py-4 h-14 rounded-[5px] font-semibold text-[16px]"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus />
          Create a coupon
        </Button>
      </div>

      {/* CREATE COUPON DIALOG */}
      <CreateCouponForm
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSaveCoupon={handleSaveCoupon}
        editingCoupon={editingCoupon}
      />

      {/* COUPONS OVERVIEW */}
      <CouponsOverview />

      {/* COUPONS TABLE */}
      <CouponsTable ref={couponsTableRef} onEdit={handleEditCoupon} />
    </>
  );
};

export default CouponsPage;
