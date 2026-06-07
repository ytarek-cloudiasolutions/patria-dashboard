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
import type { BroadcastFormData, Offer } from "../types";

const FORM_ID = "broadcast-notification-form";

const INITIAL_FORM: BroadcastFormData = { title: "", body: "" };

interface BroadcastNotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer;
  onSend?: (data: BroadcastFormData) => void;
}

const BroadcastNotificationDialog = ({
  isOpen,
  onOpenChange,
  offer,
  onSend,
}: BroadcastNotificationDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<BroadcastFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BroadcastFormData, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      setForm(
        offer
          ? {
              title: offer.offerTitle,
              body: offer.offerDescription,
            }
          : INITIAL_FORM,
      );
      setErrors({});
    }
  }, [isOpen, offer]);

  const set = (key: keyof BroadcastFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof BroadcastFormData, string>> = {};
    if (!form.title.trim()) next.title = "Notification title is required";
    if (!form.body.trim()) next.body = "Notification body is required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSend?.(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Broadcast Notification")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-[10px] bg-[#F5F5F5] px-4 py-3">
                <Bell size={18} className="shrink-0 text-[#28293D]" />
                <p className="text-[13px] font-medium text-[#28293D]">
                  {t("The notification will be sent to all registered app customers.")}
                </p>
              </div>

              <div>
                <InputField
                  data={{
                    id: "notification-title",
                    label: {
                      htmlFor: "notification-title",
                      labelText: t("Notification Title"),
                    },
                    placeholder: t("e.g Special offer to all clients"),
                    required: true,
                    inputProps: {
                      value: form.title,
                      onChange: (e) => set("title", e.target.value),
                    },
                  }}
                />
                {errors.title && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="notification-body"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Notification Body")}<span className="text-[#C90000]">*</span>
                </Label>
                <Textarea
                  id="notification-body"
                  value={form.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder={t("e.g Enjoy 20% off all product today")}
                  className="min-h-24 rounded-xl border-[#E5E5E5] px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
                />
                {errors.body && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.body}
                  </p>
                )}
              </div>
            </div>
          </form>

          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
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

export default BroadcastNotificationDialog;
