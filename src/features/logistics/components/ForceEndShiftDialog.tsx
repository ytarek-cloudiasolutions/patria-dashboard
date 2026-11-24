import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import ForceEndIcon from "@/assets/icons/force-end-shift-trash.svg";
import ForceEndSeparator from "@/assets/icons/force-end-shift-separator.svg";
import type { Driver } from "../types";

interface ForceEndShiftDialogProps {
  driver: Driver | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ForceEndShiftDialog = ({
  driver,
  isLoading,
  onOpenChange,
  onConfirm,
}: ForceEndShiftDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={!!driver}
      onOpenChange={(open) => !isLoading && onOpenChange(open)}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] gap-6 overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] ring-0 sm:max-w-[609px]"
      >
        {driver && (
          <>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#C90000] p-1">
              <img src={ForceEndIcon} alt="" className="size-8" />
            </div>

            <div className="flex w-full flex-col gap-2">
              <DialogTitle className="text-[18px] font-medium tracking-[0.36px] text-[#333]">
                {t(
                  "Are you sure you want to force-end “{driverName}’s” shift?",
                ).replace("{driverName}", driver.name)}
              </DialogTitle>
              <DialogDescription className="text-[14px] leading-[1.4] tracking-[0.28px] text-[#8B8B8B]">
                {t(
                  "This will immediately end the employee's active shift. Any ongoing shift activities will be closed, and the shift will be marked as ended.",
                )}
              </DialogDescription>
            </div>

            <img
              src={ForceEndSeparator}
              alt=""
              className="block h-px w-full"
            />

            <div className="flex w-full flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
                className="h-14 cursor-pointer rounded-[5px] border border-[#8F6900] bg-white px-[30px] text-[16px] font-semibold text-[#8F6900] hover:bg-white hover:text-[#8F6900]"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className="h-14 cursor-pointer rounded-[5px] bg-[#C90000] px-[30px] text-[16px] font-semibold text-white hover:bg-[#C90000]/90"
              >
                {isLoading ? t("Ending Shift...") : t("Force End Shift")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForceEndShiftDialog;
