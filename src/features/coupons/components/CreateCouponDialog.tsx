import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
}

const CreateCouponDialog = ({
  open,
  onOpenChange,
  children,
  title,
}: CreateCouponDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-174">
        <DialogHeader>
          <DialogTitle className="text-[#28293D] text-[24px]">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCouponDialog;
