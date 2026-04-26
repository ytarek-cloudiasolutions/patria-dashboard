import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Offer } from "../types";
import CreateOfferForm from "./CreateOfferForm";

interface CreateOfferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOffer: (offer: Offer) => void;
  editingOffer?: Offer;
}

const CreateOfferDialog = ({
  isOpen,
  onOpenChange,
  onSaveOffer,
  editingOffer,
}: CreateOfferDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[12px] sm:max-w-246.5">
        <DialogHeader>
          <DialogTitle className="text-[#28293D] text-[24px] font-semibold mb-5">
            {editingOffer ? "Edit Offer" : "Create New Offer"}
          </DialogTitle>
        </DialogHeader>
        <CreateOfferForm
          editingOffer={editingOffer}
          onCancel={handleClose}
          onSubmit={onSaveOffer}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferDialog;
