import { useState, useEffect } from "react";
import { Label } from "@/shared/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import ChevronDown from "@/assets/icons/chevronDown.svg";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Coupon } from "../types";

interface CreateCouponFormProps {
  id?: string;
  onSubmit: (coupon: Coupon) => void;
  editingCoupon?: Coupon;
}

const CreateCouponForm = ({
  id,
  onSubmit,
  editingCoupon,
}: CreateCouponFormProps) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("0");
  const [usageLimit, setUsageLimit] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDiscountMenuOpen, setIsDiscountMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    if (editingCoupon) {
      setCode(editingCoupon.code);
      setDiscountType(editingCoupon.discountType);
      setDiscountValue(editingCoupon.discountValue.toString());
      setMinOrderAmount(editingCoupon.minOrderAmount.toString());
      setUsageLimit(editingCoupon.usageLimit.toString());
      setStartDate(editingCoupon.startDate);
      setEndDate(editingCoupon.endDate);
      setIsActive(editingCoupon.isActive);
    } else {
      resetForm();
    }
  }, [editingCoupon]);

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinOrderAmount("0");
    setUsageLimit("0");
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = "Discount code is required";
    }
    if (!discountValue.trim()) {
      newErrors.discountValue = "Discount value is required";
    } else if (isNaN(Number(discountValue)) || Number(discountValue) <= 0) {
      newErrors.discountValue = "Enter a valid positive number";
    } else if (discountType === "percentage" && Number(discountValue) > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100";
    }
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) {
      newErrors.endDate = "End date is required";
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const coupon: Coupon = {
      id: editingCoupon?.id ?? Date.now(),
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrderAmount) || 0,
      usageLimit: parseInt(usageLimit) || 0,
      usedCount: editingCoupon?.usedCount ?? 0,
      startDate,
      endDate,
      isActive,
    };

    onSubmit(coupon);
    resetForm();
  };

  const overlayOpen = isDiscountMenuOpen || isStatusMenuOpen;

  return (
    <form id={id} onSubmit={handleSubmit} noValidate>
      {overlayOpen && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/50" />
      )}

      <div className="flex flex-col gap-5 px-2.5 py-2.5">
        {/* Discount Code */}
        <div>
          <InputField
            data={{
              id: "coupon-code",
              placeholder: t("e.g. SUMMER20"),
              label: { htmlFor: "coupon-code", labelText: t("Discount Code") },
              required: true,
              inputProps: {
                value: code,
                onChange: (e) => {
                  setCode(e.target.value.toUpperCase());
                  if (errors.code) setErrors((p) => ({ ...p, code: "" }));
                },
              },
            }}
          />
          {errors.code && (
            <p className="text-[#C90000] text-[13px] mt-1">{errors.code}</p>
          )}
        </div>

        {/* Discount Type + Discount Value */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex flex-col sm:flex-1">
            <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
              {t("Discount Type")}<span className="text-[#C90000]">*</span>
            </Label>
            <DropdownMenu onOpenChange={setIsDiscountMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12.5 w-full cursor-pointer justify-between overflow-hidden rounded-lg border-input bg-white px-4 text-[16px] font-normal text-[#000000] focus-visible:border-input focus-visible:ring-0"
                >
                  <span className="truncate">
                    {discountType === "percentage"
                      ? t("Percentage %")
                      : t("Fixed Price (EGP)")}
                  </span>
                  <img
                    src={ChevronDown}
                    alt=""
                    className="ml-2 w-5 h-2.75 shrink-0"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
                className="px-2 py-2 rounded-[16px]"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setDiscountType("percentage")}
                    className={`cursor-pointer ${
                      discountType === "percentage"
                        ? "bg-primary text-white rounded-[16px]"
                        : ""
                    }`}
                  >
                    {t("Percentage %")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDiscountType("fixed")}
                    className={`cursor-pointer ${
                      discountType === "fixed"
                        ? "bg-primary text-white rounded-[16px]"
                        : ""
                    }`}
                  >
                    {t("Fixed Price (EGP)")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1">
            <InputField
              data={{
                id: "discount-value",
                placeholder: t("e.g. 20"),
                label: {
                  htmlFor: "discount-value",
                  labelText:
                    discountType === "percentage"
                      ? t("Discount %")
                      : t("Discount EGP"),
                },
                inputProps: {
                  type: "number",
                  min: "0",
                  max: discountType === "percentage" ? "100" : undefined,
                  value: discountValue,
                  onChange: (e) => {
                    setDiscountValue(e.target.value);
                    if (errors.discountValue)
                      setErrors((p) => ({ ...p, discountValue: "" }));
                  },
                },
              }}
            />
            {errors.discountValue && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.discountValue}
              </p>
            )}
          </div>
        </div>

        {/* Min Order + Max Usage */}
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex-1">
            <InputField
              data={{
                id: "min-order",
                placeholder: "0",
                label: {
                  htmlFor: "min-order",
                  labelText: t("Min. Order (EGP)"),
                },
                inputProps: {
                  type: "number",
                  min: "0",
                  value: minOrderAmount,
                  onChange: (e) => setMinOrderAmount(e.target.value),
                },
              }}
            />
            <p className="text-[12px] text-[#8B8B8B] mt-1">{t("Optional")}</p>
          </div>

          <div className="flex-1">
            <InputField
              data={{
                id: "usage-limit",
                placeholder: "0",
                label: {
                  htmlFor: "usage-limit",
                  labelText: t("Maximum Usage"),
                },
                inputProps: {
                  type: "number",
                  min: "0",
                  value: usageLimit,
                  onChange: (e) => setUsageLimit(e.target.value),
                },
              }}
            />
            <p className="text-[12px] text-[#8B8B8B] mt-1">{t("Optional — 0 means unlimited")}</p>
          </div>
        </div>

        {/* Start Date + End Date */}
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex-1">
            <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
              {t("Start Date")}<span className="text-[#C90000]">*</span>
            </Label>
            <DatePicker
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (errors.startDate)
                  setErrors((p) => ({ ...p, startDate: "" }));
              }}
              placeholder="dd/MM/YYYY"
              popoverPlacement="bottom-right"
              withBackdrop
            />
            {errors.startDate && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.startDate}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
              {t("End Date")}<span className="text-[#C90000]">*</span>
            </Label>
            <DatePicker
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
                if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" }));
              }}
              placeholder="dd/MM/YYYY"
              popoverPlacement="bottom-right"
              minDate={startDate || undefined}
              withBackdrop
            />
            {errors.endDate && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
            {t("Status")}<span className="text-[#C90000]">*</span>
          </Label>
          <DropdownMenu onOpenChange={setIsStatusMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12.5 w-full cursor-pointer justify-between overflow-hidden rounded-lg border-input bg-white px-4 text-[16px] font-normal text-[#000000] focus-visible:border-input focus-visible:ring-0"
              >
                <span>{isActive ? t("Active") : t("Inactive")}</span>
                <img src={ChevronDown} alt="" className="ml-2 w-5 h-2.75 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
              className="px-2 py-2 rounded-[16px]"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setIsActive(true)}
                  className={`cursor-pointer ${
                    isActive ? "bg-primary text-white rounded-[16px]" : ""
                  }`}
                >
                  {t("Active")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsActive(false)}
                  className={`cursor-pointer ${
                    !isActive ? "bg-primary text-white rounded-[16px]" : ""
                  }`}
                >
                  {t("Inactive")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </form>
  );
};

export default CreateCouponForm;
