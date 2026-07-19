import { useEffect, useRef, useState } from "react";
import { Plus, Clock } from "lucide-react";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import ShiftCard from "./components/ShiftCard";
import NewShiftDialog from "./components/NewShiftDialog";
import DeleteShiftDialog from "./components/DeleteShiftDialog";
import { useShiftTemplates } from "./hooks/useShiftTemplates";
import type { Shift, ShiftFormData } from "./types";

const ShiftManagementPage = () => {
  const { t } = useTranslation();
  const { shifts, isLoading, saveShift, removeShift } = useShiftTemplates();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>();
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null);

  const [hasLoaded, setHasLoaded] = useState(false);
  const loadingStarted = useRef(isLoading);

  useEffect(() => {
    if (isLoading) {
      loadingStarted.current = true;
    } else if (loadingStarted.current) {
      setHasLoaded(true);
    }
  }, [isLoading]);

  const handleOpenCreate = () => {
    setEditingShift(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setIsDialogOpen(true);
  };

  const handleSave = (data: ShiftFormData, id?: string) => {
    saveShift(data, id).catch(() => {});
  };

  const handleConfirmDelete = () => {
    if (!deletingShift) return;
    removeShift(deletingShift.id).catch(() => {});
    setDeletingShift(null);
  };

  if (!hasLoaded) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Clock className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Shift Management")}
          description={t("Set shift start and end times")}
        />
        <DefaultButton
          data={{
            buttonText: t("Create New Shift"),
            icon: <Plus className="size-4.5" />,
            onClick: handleOpenCreate,
          }}
        />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {shifts.length === 0 ? (
          <p className="rounded-[16px] border border-[#E5E5E5] bg-white py-12 text-center text-[14px] text-[#8B8B8B]">
            {t("No shifts found.")}
          </p>
        ) : (
          shifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              onEdit={handleEdit}
              onDelete={setDeletingShift}
            />
          ))
        )}
      </div>

      <NewShiftDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingShift={editingShift}
        onSave={handleSave}
      />

      <DeleteShiftDialog
        open={!!deletingShift}
        onOpenChange={(open) => !open && setDeletingShift(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ShiftManagementPage;
