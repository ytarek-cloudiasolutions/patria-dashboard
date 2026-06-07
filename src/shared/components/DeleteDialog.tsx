import { Trash2 } from "lucide-react";
import DefaultButton from "./DefaultButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DeleteDialogProps } from "../types/deleteDialog.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DeleteDialogProps;
  onConfirm: () => void;
}

const capitalize = (s: string) =>
  s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);

const DeleteDialog = ({ open, onOpenChange, data, onConfirm }: Props) => {
  const { t } = useTranslation();
  const { item, type, typeBeforeName = false } = data;
  const translatedType = t(type);
  const typeLabel = capitalize(translatedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] rounded-xl border border-[#CACBD4] p-4 sm:w-full sm:max-w-152.25 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#FFF0F0] p-1">
              <Trash2 className="size-6 text-[#C90000] sm:size-8" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] font-medium text-[#333] sm:text-[18px]">
              {typeBeforeName ? (
                <>
                  {t("Are you sure you want to delete")} {translatedType}{" "}
                  <span className="font-semibold">"{item}"</span>?
                </>
              ) : (
                <>
                  {t("Are you sure you want to delete")}{" "}
                  <span className="font-semibold">"{item}"</span> {translatedType}?
                </>
              )}
            </h1>
            <p className="text-[13px] text-[#8B8B8B] sm:text-[14px]">
              {t("This action cannot be undone and will remove")}{" "}
              {typeBeforeName ? t("that") : t("the")} {translatedType}.
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
                buttonText: `${t("Delete")} ${typeBeforeName ? typeLabel : translatedType}`,
                type: "button",
                icon: <Trash2 className="size-4.5" />,
                className: "w-full sm:w-auto bg-[#C90000]",
                onClick: onConfirm,
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
