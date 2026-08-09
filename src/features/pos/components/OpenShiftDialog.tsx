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
        showCloseButton={true}
        className="w-[440px] max-w-[calc(100%-2rem)] rounded-[12px] bg-white p-6 sm:max-w-[440px]"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[20px] font-bold text-[#333333]">
            <CalendarClock className="size-5 text-primary" />
            {t("Open POS Shift")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#555]">
              {t("Opening Cash (EGP)")} *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              placeholder="0.00"
              className="h-11 w-full rounded-[8px] border border-[#E5E2DD] bg-white px-3 text-[14px] font-medium text-[#333] outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#555]">
              {t("Shift Notes (Optional)")}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Any notes for this shift...")}
              className="w-full rounded-[8px] border border-[#E5E2DD] bg-white p-3 text-[13px] text-[#333] outline-none focus:border-primary"
            />
          </div>

          <DialogFooter className="mt-6 gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 border-gray-300 text-[13px]"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 bg-primary text-[13px] font-semibold text-white hover:opacity-90"
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
