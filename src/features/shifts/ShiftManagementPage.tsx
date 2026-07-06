import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { RootState } from "@/app/store";

import ShiftCard from "./components/ShiftCard";
import DeleteShiftDialog from "./components/DeleteShiftDialog";
import { useShifts } from "./hooks/useShifts";
import type { ApiShift } from "./store/shiftsTypes";
import type { Shift } from "./types";

// Format an ISO date string as "hh:mm AM/PM"
const formatTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

// Map backend ApiShift → local UI Shift (for ShiftCard display)
const mapShift = (s: ApiShift): Shift => ({
  id: 0,
  name: s.status === "open" ? "Active Shift" : "Closed Shift",
  startTime: formatTime(s.openedAt),
  endTime: s.closedAt ? formatTime(s.closedAt) : "Active",
  color: s.status === "open" ? "#16B8A6" : "#8B8B8B",
  description: s.notes ?? "",
});

const ShiftManagementPage = () => {
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.auth.user);

  const {
    currentShift,
    loading,
    getCurrentShift,
    openShift,
    closeShift,
  } = useShifts();

  // State for the "Close Shift" confirmation dialog
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      getCurrentShift(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const mappedShifts: Shift[] = useMemo(
    () => (currentShift ? [mapShift(currentShift)] : []),
    [currentShift],
  );

  const isShiftOpen = currentShift?.status === "open";

  const handleOpenShift = () => {
    if (!user?._id) return;
    openShift({ cashierId: user._id, openingBalance: 0 });
  };

  const handleCloseShift = () => {
    if (!currentShift) return;
    closeShift({ shiftId: currentShift._id, closingBalance: 0 });
    setIsCloseDialogOpen(false);
  };

  // ShiftCard callbacks: edit → prompt close; delete → also close
  const handleEdit = (_shift: Shift) => {
    if (isShiftOpen) setIsCloseDialogOpen(true);
  };

  const handleDelete = (_shift: Shift) => {
    if (isShiftOpen) setIsCloseDialogOpen(true);
  };

  const isFetching = loading?.fetch;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Shift Management")}
          description={t("Set shift start and end times")}
        />
        {isShiftOpen ? (
          <DefaultButton
            data={{
              buttonText: t("Close Shift"),
              icon: <LogOut className="size-4.5" />,
              onClick: () => setIsCloseDialogOpen(true),
              className: "bg-[#FFF0F0] text-[#C90000]",
            }}
          />
        ) : (
          <DefaultButton
            data={{
              buttonText: loading?.open ? t("Opening…") : t("Open Shift"),
              icon: <LogIn className="size-4.5" />,
              onClick: handleOpenShift,
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {isFetching ? (
          <p className="rounded-[16px] border border-[#E5E5E5] bg-white py-12 text-center text-[14px] text-[#8B8B8B]">
            {t("Loading shift…")}
          </p>
        ) : mappedShifts.length === 0 ? (
          <p className="rounded-[16px] border border-[#E5E5E5] bg-white py-12 text-center text-[14px] text-[#8B8B8B]">
            {t("No active shift. Click 'Open Shift' to start.")}
          </p>
        ) : (
          mappedShifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Reuse DeleteShiftDialog as a Close Shift confirmation */}
      <DeleteShiftDialog
        open={isCloseDialogOpen}
        onOpenChange={(open) => !open && setIsCloseDialogOpen(false)}
        onConfirm={handleCloseShift}
      />
    </>
  );
};

export default ShiftManagementPage;
