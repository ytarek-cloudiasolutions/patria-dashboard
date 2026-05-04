import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  onConfirm: () => void;
}

const CancelSubscriptionDialog = ({
  open,
  onOpenChange,
  customerName,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[13px] sm:max-w-174">
        <DialogHeader>
          <DialogTitle>
            <div className="bg-[#FFF0F0] inline-flex p-1.25 rounded-[12px]">
              <Trash2 className="size-8 text-[#C90000]" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2.5">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#333] text-[18px] font-medium">
              Are you sure you want to cancel{" "}
              <span className="font-semibold">"{customerName}"</span>{" "}
              subscription?
            </h1>
            <p className="text-[#8B8B8B] text-[14px]">
              This will stop future deliveries. Any upcoming scheduled orders
              will be cancelled.
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
                buttonText: "Cancel Subscription",
                type: "button",
                className: "bg-[#C90000]",
                onClick: onConfirm,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
