import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface NewReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const NewReservationDialog = ({
  open,
  onOpenChange,
  title,
  children,
}: NewReservationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-174 p-6">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-[24px] font-semibold text-[#28293D]">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default NewReservationDialog;
