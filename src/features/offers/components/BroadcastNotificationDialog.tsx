import BroadcastNotificationForm from "./BroadcastNotificationForm";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface BroadcastNotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BroadcastNotificationDialog = ({
  isOpen,
  onOpenChange,
}: BroadcastNotificationDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[12px] sm:max-w-174">
        <DialogHeader>
          <DialogTitle className="text-[#28293D] text-[24px] font-semibold mb-5">
            Broadcast Notification
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mx-2.5 px-6 py-4 rounded-[10px] bg-[#E5E5E5] mb-8">
          <Bell className="size-6" />
          <p className="text-[#333333] text-[16px] font-medium">
            The notification will be sent to all registered app customers.
          </p>
        </div>
        <BroadcastNotificationForm
          onCancel={handleClose}
          onSubmit={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastNotificationDialog;
