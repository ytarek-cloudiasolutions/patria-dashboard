import { Ban } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { AppUser } from "../types";

interface BlockCustomerDialogProps {
  user: AppUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const BlockCustomerDialog = ({
  user,
  open,
  onOpenChange,
  onConfirm,
}: BlockCustomerDialogProps) => {
  const { t } = useTranslation();
  const blocking = user?.status === "Active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] rounded-xl border border-[#CACBD4] p-4 sm:w-full sm:max-w-132 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#FFF0F0] p-1.5">
              <Ban className="size-6 text-[#C90000] sm:size-7" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] font-medium text-[#333] sm:text-[18px]">
              {blocking
                ? t("Are you sure you want to block")
                : t("Are you sure you want to unblock")}{" "}
              <span className="font-semibold">"{user?.name}"</span>?
            </h1>
            <p className="text-[13px] text-[#8B8B8B] sm:text-[14px]">
              {blocking
                ? t(
                    "This customer will not be able to place new orders and will no longer receive promotional offers, marketing messages, or other communications until they are unblocked.",
                  )
                : t(
                    "This customer will regain access to place orders and receive communications.",
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
                buttonText: blocking ? t("Block Customer") : t("Unblock Customer"),
                type: "button",
                icon: <Ban className="size-4.5" />,
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

export default BlockCustomerDialog;
