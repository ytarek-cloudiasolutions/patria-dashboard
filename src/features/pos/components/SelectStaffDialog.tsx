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
import { STAFF_MEMBERS, STAFF_POSITIONS } from "../data";
import type { StaffMember } from "../types";
import { formatEgp } from "../utils";

type SelectStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const SelectStaffDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: SelectStaffDialogProps) => {
  const { t } = useTranslation();
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [position, setPosition] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedStaffId("");
    setStaffName("");
    setPosition("");
    setIsDropdownOpen(false);
    api
      .get("/users", { params: { limit: 100 } })
      .then((res) => {
        const raw: any[] = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
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
  const isOther = selectedStaffId === "other";

  const staffOptions = [
    ...staffMembers.map((staff) => ({
      value: staff.id,
      label: staff.role ? `${staff.name} (${staff.role})` : staff.name,
    })),
    { value: "other", label: t("Other") },
  ];

  return (
    <>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-75 bg-black/50 backdrop-blur-[2px] transition-all animate-in fade-in-0 duration-200" aria-hidden="true" />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[696px] max-w-[calc(100%-2rem)] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
        >
          {/* Header */}
          <DialogHeader className="p-0">
            <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
              {t("Select Staff")}
            </DialogTitle>
          </DialogHeader>

          {/* Content Body */}
          <div className="flex flex-col gap-6">
            {/* Staff Member Selection */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {t("Staff Member")} <span className="text-[#D40000]">*</span>
              </label>
              <DropdownSelect
                options={staffOptions}
                selected={selectedStaffId}
                onSelect={setSelectedStaffId}
                onOpenChange={setIsDropdownOpen}
                placeholder={t("Select Staff")}
                align="start"
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] hover:bg-white data-[state=open]:border-[#8F6900] focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer [&_svg]:size-5"
              />
            </div>

            {/* Remaining Amount Box */}
            {selectedStaff && !isOther && (
              <div className="flex flex-col gap-1 rounded-[16px] border border-dashed border-[#8F6900] bg-[#FAFAF7] p-3">
                <p className="text-[12px] font-medium tracking-[0.24px] text-[#8B8B8B]">
                  {t("Remaining amount")}
                </p>
                <p className="text-[14px] font-semibold tracking-[0.28px] text-black">
                  {formatEgp(selectedStaff.remaining ?? 0)}
                </p>
              </div>
            )}

            {/* Other Option Form Fields */}
            {isOther && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[16px] font-medium text-black">
                    {t("Staff Name")} <span className="text-[#D40000]">*</span>
                  </label>
                  <Input
                    value={staffName}
                    onChange={(event) => setStaffName(event.target.value)}
                    placeholder={t("Staff Name")}
                    className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[16px] font-medium text-black">
                    {t("Select Position")}{" "}
                    <span className="text-[#D40000]">*</span>
                  </label>
                  <DropdownSelect
                    options={STAFF_POSITIONS}
                    selected={position}
                    onSelect={setPosition}
                    onOpenChange={setIsDropdownOpen}
                    placeholder={t("Select Position")}
                    align="start"
                    className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-[16px] font-normal text-[#333333] hover:bg-white data-[state=open]:border-[#8F6900] focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer [&_svg]:size-5"
                  />
                </div>
              </div>
            )}
          </div>

        {/* Separator Line & Footer */}
        <div className="w-full border-t border-[#CACBD4] pt-4">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 disabled:opacity-50 cursor-pointer"
              disabled={!selectedStaffId || (isOther && (!staffName || !position))}
              onClick={onConfirm}
            >
              {t("Confirm Order")}
            </Button>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectStaffDialog;
