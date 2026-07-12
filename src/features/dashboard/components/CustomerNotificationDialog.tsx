import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

const FORM_ID = "customer-notification-form";

interface CustomerNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerNotificationDialog = ({
  open,
  onOpenChange,
}: CustomerNotificationDialogProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setMessage("");
      setIsLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showErrorToast(t("Please fill all required fields"));
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/notifications/broadcast", {
        title: title.trim(),
        body: message.trim(),
        message: message.trim(),
      });
      showSuccessToast(t("Notification sent successfully"));
      onOpenChange(false);
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        t("Failed to send notification");
      showErrorToast(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] ring-0 sm:max-w-150"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-6 pt-6">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Send Notification to All Customers")}
            </DialogTitle>
          </div>

          {/* Form */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            <div className="flex flex-col gap-5">
              {/* Info banner */}
              <div className="flex items-center gap-3.5 rounded-[12px] bg-primary/10 border border-primary/20 p-4 text-primary">
                <Bell className="size-5 shrink-0 text-primary" />
                <p className="text-[14px] font-medium leading-5">
                  {t("The notification will reach all customers who downloaded the app")}
                </p>
              </div>

              {/* Title input */}
              <InputField
                data={{
                  id: "notif-title",
                  label: {
                    htmlFor: "notif-title",
                    labelText: t("Notification Title"),
                  },
                  placeholder: t("e.g Special offer to all clients"),
                  required: true,
                  inputProps: {
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    disabled: isLoading,
                  },
                }}
              />

              {/* Message text input */}
              <div className="flex flex-col">
                <Label
                  htmlFor="notif-message"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Message Text")}<span className="text-[#C90000]">*</span>
                </Label>
                <Textarea
                  id="notif-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("Write the message here...")}
                  disabled={isLoading}
                  className="min-h-[148px] rounded-xl border-[#E5E5E5] bg-white px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-white px-6 pb-6">
            <Separator className="mb-5 bg-[#CACBD4]" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  disabled: isLoading,
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:px-7.5 sm:text-[16px]"
              >
                {t("Send to All")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerNotificationDialog;
