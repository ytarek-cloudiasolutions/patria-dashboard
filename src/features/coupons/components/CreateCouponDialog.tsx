import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import DefaultButton from "@/shared/components/DefaultButton";
import type { Coupon } from "../types";
import CreateCouponForm from "./CreateCouponForm";
import { useTranslation } from "@/shared/i18n/useTranslation";

const FORM_ID = "create-coupon-form";

interface CreateCouponDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCoupon: (coupon: Coupon) => void;
  editingCoupon?: Coupon;
}

const CreateCouponDialog = ({
  isOpen,
  onOpenChange,
  onSaveCoupon,
  editingCoupon,
}: CreateCouponDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-148"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-4 pt-4 sm:px-8 sm:pt-6">
            <DialogTitle className="text-[#28293D] text-[22px] font-semibold sm:text-[24px]">
              {editingCoupon ? t("Edit Coupon") : t("Create a New Coupon")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
            <CreateCouponForm
              id={FORM_ID}
              editingCoupon={editingCoupon}
              onSubmit={onSaveCoupon}
            />
          </div>

          {/* Footer */}
          <div className="bg-white px-4 py-4 sm:px-8 sm:py-5">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {editingCoupon ? t("Update Coupon") : t("Create Coupon")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCouponDialog;
