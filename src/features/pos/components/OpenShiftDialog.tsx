import { useState } from "react";
import { CalendarClock } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

type OpenShiftDialogProps = {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (openingCash: number, notes: string) => void;
};

const OpenShiftDialog = ({
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: OpenShiftDialogProps) => {
  const { t } = useTranslation();
  const [openingCash, setOpeningCash] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(openingCash) || 0;
    onConfirm(cash, notes);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[480px] max-w-[calc(100%-2rem)] rounded-[16px] border border-[#E5E5E5] bg-white p-6 sm:p-7"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-[20px] font-bold text-[#333333]">
            <CalendarClock className="size-5 text-primary" />
            {t("Open POS Shift")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#333333]">
              {t("Opening Cash (EGP)")} <span className="text-[#D40000]">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              placeholder="0.00"
              className="h-11 w-full rounded-[8px] border border-[#E5E2DD] bg-white px-4 text-[14px] font-medium text-[#333333] outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#333333]">
              {t("Shift Notes (Optional)")}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Any notes for this shift...")}
              className="w-full rounded-[8px] border border-[#E5E2DD] bg-white p-3 text-[13px] text-[#333333] outline-none focus:border-primary"
            />
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary cursor-pointer"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 min-w-[140px] rounded-[8px] bg-primary text-[13px] font-semibold text-white cursor-pointer"
            >
              {isLoading ? t("Opening...") : t("Open Shift")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OpenShiftDialog;
