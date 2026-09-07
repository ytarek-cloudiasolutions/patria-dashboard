import { Lottie } from "lottie-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DiscountOfferItem } from "./SelectDiscountOfferDialog";
import approvalRequestAnimation from "@/assets/animations/approval-request.json";

interface DiscountApprovalRequestDialogProps {
  open: boolean;
  offer: DiscountOfferItem | null;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (offer: DiscountOfferItem) => void;
  onReject: () => void;
}

const DiscountApprovalRequestDialog = ({
  open,
  offer,
  isLoading = false,
  onOpenChange,
  onApprove,
  onReject,
}: DiscountApprovalRequestDialogProps) => {
  const { t } = useTranslation();

  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[696px] max-w-[calc(100%-2rem)] gap-4 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]"
      >
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black text-center">
            {t("Approval Request")}
          </DialogTitle>
        </DialogHeader>

        {/* Center Lottie Animation */}
        <div className="flex justify-center items-center py-2">
          <div className="size-[150px] flex items-center justify-center">
            <Lottie
              src={approvalRequestAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 150, height: 150 }}
            />
          </div>
        </div>

        {/* Details Text Block */}
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <h4 className="text-[16px] font-semibold text-black tracking-[0.32px]">
            {t("Approval Request from")} {offer.requestedByRole || offer.requestedByName || t("Super Admin")}
          </h4>
          <p className="text-[14px] font-semibold text-black tracking-[0.28px]">
            {offer.value}% {t("Discount")} — {offer.name}
          </p>
          <p className="text-[14px] font-medium text-[#595959] tracking-[0.28px]">
            {offer.value}% {t("Discount Request")} ({offer.name}) — {t("Cashier")} {offer.requestedByName || offer.requestedByRole || t("Super Admin")}
          </p>
        </div>

        <div className="w-full border-t border-[#CACBD4] mt-2 pt-4">
          <div className="flex items-center justify-center gap-6">
            <Button
              type="button"
              disabled={isLoading}
              onClick={onReject}
              className="flex-1 h-[56px] bg-[#C90000] text-white font-semibold text-[16px] rounded-[5px] cursor-pointer disabled:opacity-60"
            >
              {t("Reject")}
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => onApprove(offer)}
              className="flex-1 h-[56px] bg-[#E2F4ED] border border-[#059B5A] text-[#059B5A] font-semibold text-[16px] rounded-[5px] cursor-pointer disabled:opacity-60"
            >
              {t("Approve")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountApprovalRequestDialog;
