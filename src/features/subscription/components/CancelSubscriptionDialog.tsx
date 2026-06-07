import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import type { Subscription } from "../types";

interface CancelSubscriptionDialogProps {
  open: boolean;
  subscription: Subscription | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (subscriptionId: number) => void;
}

const CancelSubscriptionDialog = ({
  open,
  subscription,
  onOpenChange,
  onConfirm,
}: CancelSubscriptionDialogProps) => {
  if (!subscription) return null;

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

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] font-medium text-[#333] sm:text-[18px]">
              Are you sure you want to cancel{" "}
              <span className="font-semibold">
                "{subscription.customerName}"
              </span>{" "}
              subscription?
            </h1>
            <p className="text-[13px] text-[#8B8B8B] sm:text-[14px]">
              This will stop future deliveries. Any upcoming scheduled orders
              will be cancelled.
            </p>
          </div>
          <Separator className="bg-[#CACBD4]" />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "w-full sm:w-auto text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Cancel Subscription",
                type: "button",
                icon: <Trash2 className="size-4.5" />,
                className: "w-full sm:w-auto bg-[#C90000]",
                onClick: () => onConfirm(subscription.id),
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
