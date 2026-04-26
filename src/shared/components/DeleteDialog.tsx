import { Trash2 } from "lucide-react";
import DefaultButton from "./DefaultButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { DeleteDialogProps } from "../types/deleteDialog.types";
import { Separator } from "./ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DeleteDialogProps;
  onConfirm: () => void;
}

const DeleteDialog = ({ open, onOpenChange, data, onConfirm }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[13px] sm:max-w-152.25">
        <DialogHeader>
          <DialogTitle>
            <div className="bg-[#FFF0F0] inline-flex p-1.25 rounded-[12px] ">
              <Trash2 className="size-8 text-[#C90000]" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-6 py-2.5">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#333] text-[18px] font-medium">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{data.item}"</span> {data.type}?
            </h1>
            <p className="text-[#8B8B8B] text-[14px]">
              This action cannot be undone and will remove the {data.type}.
            </p>
          </div>
          <Separator className="bg-[#CACBD4]" />
          <div className="flex justify-end gap-4">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: `Delete ${data.type}`,
                type: "button",
                icon: <Trash2 className="size-4.5" />,
                className: "bg-[#C90000]",
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
