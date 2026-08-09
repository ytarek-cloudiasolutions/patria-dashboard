import { useState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

type CloseShiftDialogProps = {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (closingCash: number, notes: string) => void;
};

const CloseShiftDialog = ({
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: CloseShiftDialogProps) => {
  const { t } = useTranslation();
  const [closingCash, setClosingCash] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(closingCash) || 0;
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
            <Lock className="size-5 text-[#D40000]" />
            {t("Close POS Shift")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#555]">
              {t("Closing Cash Balance (EGP)")} *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={closingCash}
              onChange={(e) => setClosingCash(e.target.value)}
              placeholder="0.00"
              className="h-11 w-full rounded-[8px] border border-[#E5E2DD] bg-white px-3 text-[14px] font-medium text-[#333] outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#555]">
              {t("Closing Notes (Optional)")}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Any closing remarks...")}
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
              className="h-11 bg-[#D40000] text-[13px] font-semibold text-white hover:bg-[#b50000]"
            >
              {isLoading ? t("Closing...") : t("Close Shift")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CloseShiftDialog;
