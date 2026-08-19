import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
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
        className="w-[696px] max-w-[calc(100%-2rem)] sm:max-w-[696px] gap-8 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Open POS Shift")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-[10px]">
          <div className="flex flex-col gap-2.5">
            <label className="text-[16px] font-medium text-black">
              {t("Opening Cash (EGP)")}{" "}
              <span className="text-[#C90000]">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              placeholder="0"
              className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] font-normal text-black placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[16px] font-medium text-black">
              {t("Shift Notes")}{" "}
              <span className="text-[13px] font-medium text-[#595959]">
                ({t("Optional")})
              </span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Any notes for this shift")}
              className="w-full min-h-[90px] rounded-[8px] border border-[#8E8E8E] bg-[#FEFEFE] px-[14px] pt-[12px] pb-[40px] text-[13px] font-normal leading-[18.2px] tracking-[0.26px] text-black placeholder:text-[#595959] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
            />
          </div>

          {/* Separator Line */}
          <div className="w-full border-t border-[#CACBD4]" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold leading-[24px] text-[#8F6900] transition-colors hover:bg-[#8F6900]/5 cursor-pointer"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold leading-[24px] text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? t("Opening...") : t("Open Shift")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OpenShiftDialog;
