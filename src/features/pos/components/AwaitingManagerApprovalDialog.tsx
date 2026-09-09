import { Lottie } from "lottie-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DiscountOfferItem } from "./SelectDiscountOfferDialog";
import loadingDotsAnimation from "@/assets/animations/loading-dots.json";

interface AwaitingManagerApprovalDialogProps {
  open: boolean;
  offer: DiscountOfferItem | null;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelRequest: () => void;
}

const AwaitingManagerApprovalDialog = ({
  open,
  offer,
  isLoading = false,
  onOpenChange,
  onCancelRequest,
}: AwaitingManagerApprovalDialogProps) => {
  const { t } = useTranslation();

  const discountValue = offer?.value ?? 20;
  const discountName = offer?.name || "Discount";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="w-[696px] max-w-[calc(100%-2rem)] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[696px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black text-center">
            {t("Awaiting Manager Approval")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 px-2">
          {/* Lottie Loading Dots Animation */}
          <div className="flex justify-center items-center h-[85px] w-[150px]">
            <Lottie
              src={loadingDotsAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 150, height: 85 }}
            />
          </div>

          {/* Description text */}
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <p className="text-[14px] font-semibold text-black tracking-[0.28px] leading-relaxed">
              {t("We have sent the")} {discountValue}% {t("discount request")} ({discountName}){" "}
              {t("to the manager/super admin—notifications have been sent via the system and WhatsApp.")}
            </p>
            <p className="text-[14px] font-medium text-[#595959] tracking-[0.28px] leading-relaxed">
              {t("It will be applied automatically as soon as it's approved; feel free to wait here.")}
            </p>
          </div>

          {/* Action separator & Cancel Request button */}
          <div className="w-full border-t border-[#CACBD4] pt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancelRequest}
              disabled={isLoading}
              className="h-[56px] px-[30px] rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] cursor-pointer disabled:opacity-60"
            >
              {t("Cancel Request")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AwaitingManagerApprovalDialog;
