import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import CouponsOverview from "../components/CouponsOverview";
import CouponsTable from "../components/CouponsTable";
import CreateCouponForm from "../components/CreateCouponForm";
import CreateCouponDialog from "../components/CreateCouponDialog";
import type { CouponProps } from "../types";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";

const CouponsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponProps | undefined>();
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps | null>(
    null
  );
  const couponsTableRef = useRef<{
    addCoupon: (coupon: CouponProps) => void;
    updateCoupon: (coupon: CouponProps) => void;
    deleteCoupon: (couponId: number) => void;
  }>(null);

  const handleSaveCoupon = (coupon: CouponProps) => {
    if (editingCoupon) {
      couponsTableRef.current?.updateCoupon(coupon);
    } else {
      couponsTableRef.current?.addCoupon(coupon);
    }
    setEditingCoupon(undefined);
    setIsDialogOpen(false);
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

  const handleDeleteCoupon = (coupon: CouponProps) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCoupon) return;

    couponsTableRef.current?.deleteCoupon(selectedCoupon.id);
    setIsDeleteDialogOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <HeaderLayout
          title="Coupons"
          description="Customer discount code management and mobile application"
        />
        <DefaultButton
          data={{
            buttonText: "Create a coupon",
            icon: <Plus className="size-4.5" />,
            onClick: () => setIsDialogOpen(true),
          }}
        />
      </div>

      {/* CREATE COUPON DIALOG */}
      <CreateCouponDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingCoupon ? "Edit Coupon" : "Create a New Coupon"}
      >
        <CreateCouponForm
          key={editingCoupon?.id ?? "new-coupon"}
          initialData={editingCoupon}
          onSave={handleSaveCoupon}
          onCancel={() => handleCloseDialog(false)}
        />
      </CreateCouponDialog>

      {/* COUPONS OVERVIEW */}
      <CouponsOverview />

      {/* COUPONS TABLE */}
      <CouponsTable
        ref={couponsTableRef}
        onEdit={handleEditCoupon}
        onDelete={handleDeleteCoupon}
      />

      {/* DELETE COUPON DIALOG */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        data={{
          item: selectedCoupon?.code ?? "",
          type: "coupon",
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CouponsPage;
