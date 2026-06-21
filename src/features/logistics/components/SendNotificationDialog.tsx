import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Driver, DriverNotification } from "../types";

const FORM_ID = "send-notification-form";

interface SendNotificationDialogProps {
  driver: Driver | null;
  onOpenChange: (open: boolean) => void;
  onSend: (driver: Driver, notification: DriverNotification) => void;
}

const SendNotificationDialog = ({
  driver,
  onOpenChange,
  onSend,
}: SendNotificationDialogProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (driver) {
      setTitle("");
      setMessage("");
      setError("");
    }
  }, [driver]);

  if (!driver) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("Notice title is required"));
      return;
    }
    onSend(driver, { title: title.trim(), message: message.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!driver} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-145"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-bold text-[#28293D]">
              {t("Send Notification to")}{" "}
              <span className="text-[#28293D]">{driver.name.split(" ")[0]}</span>
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex items-center gap-2 rounded-[10px] bg-[#F4F4F4] px-4 py-3">
              <Bell className="size-4 text-[#595959]" />
              <span className="text-[13px] text-[#595959]">
                {t("The notification will arrive immediately on the Driver app.")}
              </span>
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="notice-title"
                className="mb-2 text-[14px] font-semibold text-[#28293D]"
              >
                {t("Notice title")}<span className="text-[#C90000]">*</span>
              </Label>
              <Input
                id="notice-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError("");
                }}
                placeholder={t("e.g: Management Notice")}
                className="h-12 rounded-[8px] border-[#E5E5E5] px-4 text-[14px] focus-visible:border-primary focus-visible:ring-0"
              />
              {error && (
                <p className="mt-1 text-[13px] text-[#C90000]">{error}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="notice-message"
                className="mb-2 text-[14px] font-semibold text-[#28293D]"
              >
                {t("Message Text")}
              </Label>
              <Textarea
                id="notice-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("Write your message here...")}
                className="min-h-24 rounded-[10px] border-[#E5E5E5] px-4 py-3 text-[14px] focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
          </form>

          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4]" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Send Notification")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationDialog;
