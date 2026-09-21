import { useEffect, useState } from "react";
import { api } from "@/config/api";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useAuth } from "@/features/auth";
import { STAFF_MEMBERS } from "../data";
import type { StaffMember } from "../types";
import SuperAdminApprovalDialog from "./SuperAdminApprovalDialog";

export interface StaffOrderConfirmationData {
  staffId: string;
  staffName: string;
  discountType: "without_discount" | "percentage" | "fixed";
  discountValue: number;
  discountReason?: string;
  adminApproved?: boolean;
  approvedBy?: string;
}

type SelectStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: StaffOrderConfirmationData) => void;
};

const SelectStaffDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: SelectStaffDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const normalizedRole = (user?.role || "").toLowerCase().replace(/[\s_-]+/g, "");
  const isSuperAdmin =
    normalizedRole === "superadmin" ||
    normalizedRole === "super_admin" ||
    normalizedRole.includes("superadmin") ||
    normalizedRole === "admin";

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [discountType, setDiscountType] = useState<"without_discount" | "percentage" | "fixed">("without_discount");
  const [discountValue, setDiscountValue] = useState("20");
  const [discountReason, setDiscountReason] = useState("");
  const [isValueFocused, setIsValueFocused] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

  const isDropdownOpen = isStaffDropdownOpen || isDiscountDropdownOpen;

  useEffect(() => {
    if (!open) {
      setIsApprovalOpen(false);
      setIsStaffDropdownOpen(false);
      setIsDiscountDropdownOpen(false);
      return;
    }
    setSelectedStaffId("");
    setDiscountType("without_discount");
    setDiscountValue("20");
    setDiscountReason("");
    setIsApprovalOpen(false);
    setIsStaffDropdownOpen(false);
    setIsDiscountDropdownOpen(false);

    api
      .get("/users", { params: { limit: 100 } })
      .then((res) => {
        const raw: any[] =
          res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
        if (raw.length > 0) {
          const mapped: StaffMember[] = raw.map((u) => ({
            id: u._id || u.id,
            name: u.name || u.email || "Staff Member",
            role: u.role || "Staff",
            remaining: 120,
          }));
          setStaffMembers(mapped);
        }
      })
      .catch(() => setStaffMembers(STAFF_MEMBERS));
  }, [open]);

  const selectedStaff =
    staffMembers.find((staff) => staff.id === selectedStaffId) ?? null;

  const staffOptions = staffMembers.map((staff) => ({
    value: staff.id,
    label: staff.role ? `${staff.name} (${staff.role})` : staff.name,
  }));

  const discountTypeOptions = [
    { value: "without_discount", label: t("Without discount") },
    { value: "percentage", label: t("Percentage %") },
    { value: "fixed", label: t("Fixed amount") },
  ];

  const handleConfirmOrder = () => {
    if (!selectedStaffId) return;

    const numValue = Number(discountValue) || 0;
    const finalVal =
      discountType === "percentage"
        ? Math.min(100, Math.max(0, numValue))
        : Math.max(0, numValue);

    if (discountType === "without_discount") {
      onConfirm({
        staffId: selectedStaffId,
        staffName: selectedStaff?.name || "Staff Member",
        discountType: "without_discount",
        discountValue: 0,
      });
      onOpenChange(false);
    } else if (isSuperAdmin) {
      // Super admin is already logged in — directly apply without asking for credentials
      onConfirm({
        staffId: selectedStaffId,
        staffName: selectedStaff?.name || "Staff Member",
        discountType,
        discountValue: finalVal,
        discountReason: discountReason.trim() || undefined,
        adminApproved: true,
        approvedBy: user?.name || user?.email || "Super Admin",
      });
      onOpenChange(false);
    } else {
      // Non-super-admin cashiers require super admin credential approval dialog
      setIsApprovalOpen(true);
    }
  };

  const handleSuperAdminApproved = (adminUser: any) => {
    setIsApprovalOpen(false);
    const numValue = Number(discountValue) || 0;
    const finalVal =
      discountType === "percentage"
        ? Math.min(100, Math.max(0, numValue))
        : Math.max(0, numValue);

    onConfirm({
      staffId: selectedStaffId,
      staffName: selectedStaff?.name || "Staff Member",
      discountType,
      discountValue: finalVal,
      discountReason: discountReason.trim() || undefined,
      adminApproved: true,
      approvedBy: adminUser?.name || adminUser?.email,
    });
    onOpenChange(false);
  };

  const getValuePlaceholder = () => {
    if (discountType === "without_discount") return "e.g. 20";
    if (discountType === "percentage") return "20 %";
    return "e.g. 50";
  };

  const getFormattedValue = () => {
    if (discountType === "without_discount") return "";
    if (isValueFocused) return discountValue;
    if (!discountValue) return "";
    if (discountType === "percentage") return `${discountValue} %`;
    return `${discountValue} EGP`;
  };

  return (
    <>
      {/* Dark backdrop blur effect when either dropdown is open */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-75 bg-black/50 backdrop-blur-[2px] transition-all animate-in fade-in-0 duration-200"
          aria-hidden="true"
        />
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[14px] border border-[#CACBD4] bg-white p-7 shadow-2xl sm:max-w-[620px]"
        >
          {/* Header */}
          <DialogHeader className="p-0 text-left mb-6">
            <DialogTitle className="text-[24px] font-semibold text-[#111827] tracking-[0.2px]">
              {t("Select Staff")}
            </DialogTitle>
          </DialogHeader>

          {/* Form Body */}
          <div className="flex flex-col gap-5">
            {/* Staff Member Field */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {t("Staff Member")}
              </label>
              <DropdownSelect
                options={staffOptions}
                selected={selectedStaffId}
                onSelect={setSelectedStaffId}
                onOpenChange={setIsStaffDropdownOpen}
                placeholder={t("Select Staff")}
                align="start"
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#23252A] hover:bg-white data-[state=open]:border-[#8F6900] data-[state=open]:relative data-[state=open]:z-80 focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer"
              />
            </div>

            {/* Discount Type and Value Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Discount Type */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-black">
                  {t("Discount Type")}
                </label>
                <DropdownSelect
                  options={discountTypeOptions}
                  selected={discountType}
                  onSelect={(val) => {
                    const newType = val as "without_discount" | "percentage" | "fixed";
                    setDiscountType(newType);
                  }}
                  onOpenChange={setIsDiscountDropdownOpen}
                  placeholder={t("Without discount")}
                  align="start"
                  className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#23252A] hover:bg-white data-[state=open]:border-[#8F6900] data-[state=open]:relative data-[state=open]:z-80 focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer"
                />
              </div>

              {/* Value */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-black">
                  {t("Value")}
                </label>
                {discountType === "without_discount" ? (
                  <div className="flex h-[50px] w-full items-center gap-3 rounded-[12px] border border-[#CACBD4] bg-[#E5E5E5] p-3 text-[16px] font-normal text-[#8B8B8B] select-none cursor-not-allowed">
                    <span className="flex-1 text-[#8B8B8B] leading-none">
                      {getValuePlaceholder()}
                    </span>
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder={getValuePlaceholder()}
                    value={getFormattedValue()}
                    onFocus={() => setIsValueFocused(true)}
                    onBlur={() => setIsValueFocused(false)}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9.]/g, "");
                      if (discountType === "percentage") {
                        if (
                          clean === "" ||
                          (Number(clean) >= 0 && Number(clean) <= 100)
                        ) {
                          setDiscountValue(clean);
                        }
                      } else {
                        if (clean === "" || Number(clean) >= 0) {
                          setDiscountValue(clean);
                        }
                      }
                    }}
                    className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#23252A] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Reason for the discount (Optional) - Only when discount is enabled */}
            {discountType !== "without_discount" && (
              <div className="flex flex-col gap-2.5 animate-in fade-in-50 duration-200">
                <label className="text-[16px] font-medium text-black">
                  {t("Reason for the discount")}{" "}
                  <span className="font-normal text-[#8B8B8B]">
                    ({t("Optional")})
                  </span>
                </label>
                <Input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder={t("Reason for the discount")}
                  className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] text-[#23252A] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Separator Line */}
          <div className="my-6 w-full border-t border-[#E5E5E5]" />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[50px] min-w-[120px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmOrder}
              disabled={
                !selectedStaffId ||
                (discountType !== "without_discount" && (!discountValue || Number(discountValue) <= 0))
              }
              className="h-[50px] min-w-[150px] px-6 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white hover:bg-[#8F6900]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Confirm Order")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Super Admin Approval Dialog on top */}
      <SuperAdminApprovalDialog
        open={isApprovalOpen}
        onOpenChange={setIsApprovalOpen}
        onCancel={() => setIsApprovalOpen(false)}
        onConfirm={handleSuperAdminApproved}
      />
    </>
  );
};

export default SelectStaffDialog;
