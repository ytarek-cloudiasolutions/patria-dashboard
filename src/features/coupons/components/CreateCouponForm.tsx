import { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import ChevronDown from "@/assets/icons/chevronDown.svg";
import { Separator } from "@/shared/components/ui/separator";
import type { CouponProps } from "../types";

interface CreateCouponFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCoupon?: (coupon: CouponProps) => void;
  editingCoupon?: CouponProps;
}

const CreateCouponForm = ({
  isOpen,
  onOpenChange,
  onSaveCoupon,
  editingCoupon,
}: CreateCouponFormProps) => {
  const [formData, setFormData] = useState({
    couponCode: "",
    discountType: "Percentage" as "Percentage" | "Fixed",
    discountValue: "",
    minOrderFee: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Initialize form with editing coupon data when modal opens
  useEffect(() => {
    const initializeForm = async () => {
      if (isOpen && editingCoupon) {
        setFormData({
          couponCode: editingCoupon.code,
          discountType: editingCoupon.discountType,
          discountValue: editingCoupon.discountValue.toString(),
          minOrderFee: editingCoupon.minOrderFee?.toString() || "",
          usageLimit: editingCoupon.usageLimit?.toString() || "",
          startDate: editingCoupon.startDate,
          endDate: editingCoupon.endDate,
          isActive: editingCoupon.isActive,
        });
      } else if (isOpen) {
        // Reset form for new coupon
        setFormData({
          couponCode: "",
          discountType: "Percentage",
          discountValue: "",
          minOrderFee: "",
          usageLimit: "",
          startDate: "",
          endDate: "",
          isActive: true,
        });
      }
    };
    initializeForm();
  }, [isOpen, editingCoupon]);

  // Helper functions to update form data
  const updateFormData = (
    key: keyof typeof formData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.couponCode ||
      !formData.discountValue ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newCoupon: CouponProps = {
      id: editingCoupon?.id || Math.floor(Math.random() * 10000),
      code: formData.couponCode,
      discountType: formData.discountType,
      discountValue: parseInt(formData.discountValue),
      minOrderFee: formData.minOrderFee
        ? parseInt(formData.minOrderFee)
        : undefined,
      usageCount: editingCoupon?.usageCount || 0,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit)
        : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
    };

    onSaveCoupon?.(newCoupon);

    // Reset form
    setFormData({
      couponCode: "",
      discountType: "Percentage",
      discountValue: "",
      minOrderFee: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });

    onOpenChange(false);
  };

  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent className="w-174">
        <CustomDialogHeader>
          <CustomDialogTitle className="font-semibold text-[24px] text-[#333333]">
            {editingCoupon ? "Edit Coupon" : "Create a New Coupon"}
          </CustomDialogTitle>
        </CustomDialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <Label
                htmlFor="coupon-code"
                className="label-base mb-2.5"
                aria-required
              >
                Discount Code<span className="text-[#C90000]">*</span>
              </Label>
              <Input
                id="coupon-code"
                type="text"
                placeholder="e.g. WELCOME20"
                value={formData.couponCode}
                onChange={(e) => updateFormData("couponCode", e.target.value)}
                className="input-field input-base w-157 "
              />
            </div>
            <div className="flex gap-4">
              <div>
                <Label
                  htmlFor="discount-type"
                  className="label-base mb-2.5"
                  aria-required
                >
                  Discount Type<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="font-normal text-[16px] text-[#000000] h-12.5 w-76.5 flex justify-between px-3"
                    >
                      {formData.discountType === "Percentage"
                        ? "Percentage %"
                        : "Fixed amount (EGP)"}
                      <img
                        src={ChevronDown}
                        alt="Chevron Down"
                        className="w-5 h-2.75"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[193.33px] px-2 py-2 rounded-[16px]">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          updateFormData("discountType", "Percentage")
                        }
                        className={`cursor-pointer ${
                          formData.discountType === "Percentage"
                            ? "bg-primary text-white rounded-[16px]"
                            : ""
                        }`}
                      >
                        Percentage %
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateFormData("discountType", "Fixed")}
                        className={`cursor-pointer ${
                          formData.discountType === "Fixed"
                            ? "bg-primary text-white rounded-[16px]"
                            : ""
                        }`}
                      >
                        Fixed amount (EGP)
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <Label
                  htmlFor="discount-value"
                  className="label-base mb-2.5"
                  aria-required
                >
                  Discount{" "}
                  {formData.discountType === "Percentage" ? "%" : "EGP"}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  placeholder={
                    formData.discountType === "Percentage"
                      ? "e.g. 20"
                      : "e.g. 50"
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    updateFormData("discountValue", e.target.value)
                  }
                  className="input-field input-base w-76.5"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="min-order-fee" className="label-base mb-2.5">
                  Min. Order (EGP) (Optional)
                </Label>
                <Input
                  id="min-order-fee"
                  type="number"
                  placeholder="e.g. 85"
                  value={formData.minOrderFee}
                  onChange={(e) =>
                    updateFormData("minOrderFee", e.target.value)
                  }
                  className="input-field input-base w-76.5"
                />
              </div>
              <div>
                <Label htmlFor="usage-limit" className="label-base mb-2.5">
                  Maximum Usage (Optional)
                </Label>
                <Input
                  id="usage-limit"
                  type="number"
                  placeholder="e.g. 20"
                  value={formData.usageLimit}
                  onChange={(e) => updateFormData("usageLimit", e.target.value)}
                  className="input-field input-base w-76.5"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Label
                  htmlFor="start-date"
                  className="label-base mb-2.5"
                  aria-required
                >
                  Start Date<span className="text-[#C90000]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      updateFormData("startDate", e.target.value)
                    }
                    placeholder="dd/MM/YYYY"
                    className="input-field input-base w-76.5 pr-10"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="end-date"
                  className="label-base mb-2.5"
                  aria-required
                >
                  End Date<span className="text-[#C90000]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData("endDate", e.target.value)}
                    placeholder="dd/MM/YYYY"
                    className="input-field input-base w-76.5 pr-10"
                  />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <Label
                htmlFor="status"
                className="label-base mb-2.5"
                aria-required
              >
                Status<span className="text-[#C90000]">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-normal text-[16px] text-[#000000] h-12.5 w-157 flex justify-between px-3"
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                    <img
                      src={ChevronDown}
                      alt="Chevron Down"
                      className="w-5 h-2.75"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[193.33px] px-2 py-2 rounded-[16px]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => updateFormData("isActive", true)}
                      className={`cursor-pointer ${
                        formData.isActive
                          ? "bg-primary text-white rounded-[16px]"
                          : ""
                      }`}
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateFormData("isActive", false)}
                      className={`cursor-pointer ${
                        !formData.isActive
                          ? "bg-primary text-white rounded-[16px]"
                          : ""
                      }`}
                    >
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="bg-[#CACBD4] mb-6" />
          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
                type="submit"
              >
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </div>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default CreateCouponForm;
