import { CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { OpeningBalanceRecord } from "../types";

interface ConfirmOpeningBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: OpeningBalanceRecord | null;
  onConfirm?: (record?: OpeningBalanceRecord | null) => void;
}

const ConfirmOpeningBalanceDialog = ({
  open,
  onOpenChange,
  record,
  onConfirm,
}: ConfirmOpeningBalanceDialogProps) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm?.(record);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex flex-col gap-6 p-6 sm:p-7">
          {/* Green Double Check Icon */}
          <div className="flex size-12 items-center justify-center rounded-[10px] bg-[#E2F4ED]">
            <CheckCheck className="size-8 text-[#059B5A]" />
          </div>

          {/* Text Container */}
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-[18px] font-semibold text-[#333333] tracking-[0.36px]">
              {t(
                "Are you sure you want to confirm the opening balance and apply it to inventory?"
              )}
            </DialogTitle>
            <p className="text-[14px] font-normal leading-[19.6px] tracking-[0.28px] text-[#8B8B8B]">
              {t(
                "This will apply the opening balance quantities to your inventory. This action cannot be undone."
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4">
            <Separator className="bg-[#CACBD4]" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                type="button"
                onClick={handleConfirm}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOpeningBalanceDialog;
