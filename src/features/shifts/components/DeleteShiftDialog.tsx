import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface DeleteShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteShiftDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteShiftDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] rounded-xl border border-[#CACBD4] p-4 sm:w-full sm:max-w-135 sm:p-6"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="inline-flex items-center justify-center rounded-[10px] bg-[#C90000] p-2">
              <Trash2 className="size-6 text-white" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] font-medium text-[#333333] sm:text-[18px]">
              {t("Are you sure you want to delete this shift?")}
            </h1>
            <p className="text-[13px] text-[#8B8B8B] sm:text-[14px]">
              {t(
                "This will remove the shift. Any upcoming scheduled work for this shift will be cancelled.",
              )}
            </p>
          </div>

          <Separator className="bg-[#CACBD4]" />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
            <DefaultButton
              data={{
                buttonText: t("Cancel"),
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "w-full sm:w-auto text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: t("Delete Shift"),
                type: "button",
                className: "w-full sm:w-auto bg-[#C90000]",
                onClick: onConfirm,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteShiftDialog;
