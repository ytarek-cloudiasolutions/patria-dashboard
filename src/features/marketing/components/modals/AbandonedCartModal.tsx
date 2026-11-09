import { useState, useEffect } from "react";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import DefaultButton from "@/shared/components/DefaultButton";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import type { AbandonedCartConfig } from "../../types";
import marketingApi from "../../api/marketingApi";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

const FORM_ID = "abandoned-cart-form";

interface AbandonedCartModalProps {
  isOpen: boolean;
  config: AbandonedCartConfig;
  onClose: () => void;
  onSave: (newConfig: AbandonedCartConfig) => void;
}

export const AbandonedCartModal = ({
  isOpen,
  config,
  onClose,
  onSave,
}: AbandonedCartModalProps) => {
  const { t } = useTranslation();

  const [form, setForm] = useState<AbandonedCartConfig>(config);
  const [testNumber, setTestNumber] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load the real saved config from the server every time the dialog opens.
  useEffect(() => {
    if (!isOpen) return;
    setForm(config);
    setTestNumber("");
    setIsSendingTest(false);
    marketingApi
      .getAbandonedCartConfig()
      .then(setForm)
      .catch((err) => console.error("Failed to load abandoned cart config:", err));
  }, [isOpen, config]);

  const handleSendTest = async () => {
    if (!testNumber.trim()) {
      showErrorToast(t("Please enter a valid phone number."));
      return;
    }
    setIsSendingTest(true);
    try {
      await marketingApi.testSend({
        channel: form.channels.app ? "app" : "whatsapp",
        phone: testNumber.trim(),
        title: form.title,
        message: form.message,
      });
      showSuccessToast(
        t("Test reminder sent successfully to {phone}").replace("{phone}", testNumber)
      );
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to send test reminder"));
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await marketingApi.updateAbandonedCartConfig(form);
      onSave(saved);
      showSuccessToast(t("Abandoned cart settings saved successfully!"));
      onClose();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to save settings"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white p-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] ring-0 sm:max-w-[696px]"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-6 pt-6 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[22px] sm:text-[24px] font-semibold text-black font-['Montserrat',sans-serif] tracking-wide">
              {t("Abandoned Cart Reminder")}
            </DialogTitle>
            <p className="mt-1 text-[14px] sm:text-[16px] font-normal text-[#595959] font-['Montserrat',sans-serif] leading-6 tracking-tight">
              {t(
                "Automatically remind customers who leave items in their cart."
              )}
            </p>
          </div>

          {/* Form Body - scrollable */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-6 sm:px-7 scrollbar-none"
          >
            <div className="flex flex-col gap-6">
              {/* Row 1: Notification Title & Notification Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[16px] font-medium text-black font-['Montserrat',sans-serif]">
                    {t("Notification Title")}
                  </label>
                  <div className="h-12 px-3.5 bg-white rounded-xl border border-[#CACBD4] focus-within:border-primary flex items-center transition-colors">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder={t("Title")}
                      required
                      className="w-full bg-transparent text-[#1A1A1A] placeholder:text-[#8B8B8B] text-[16px] font-normal font-['Montserrat',sans-serif] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[16px] font-medium text-black font-['Montserrat',sans-serif]">
                    {t("Notification Message")}
                  </label>
                  <div className="h-12 px-3.5 bg-white rounded-xl border border-[#CACBD4] focus-within:border-primary flex items-center transition-colors">
                    <input
                      type="text"
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder={t("Message")}
                      required
                      className="w-full bg-transparent text-[#1A1A1A] placeholder:text-[#8B8B8B] text-[16px] font-normal font-['Montserrat',sans-serif] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Send reminder (delay) */}
              <div className="flex flex-col gap-2.5 sm:w-1/2 sm:pr-3">
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-medium text-black font-['Montserrat',sans-serif]">
                    {t("Send reminder after")}
                  </span>
                </div>
                <div className="h-12 px-3.5 bg-white rounded-xl border border-[#CACBD4] focus-within:border-primary flex justify-between items-center gap-2 overflow-hidden transition-colors">
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      min={5}
                      value={form.delayMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setForm((prev) => ({
                          ...prev,
                          delayMinutes: isNaN(val) ? 5 : Math.max(5, val),
                        }));
                      }}
                      style={{
                        width: `${Math.max(1, String(form.delayMinutes).length)}ch`,
                      }}
                      className="p-0 m-0 border-0 text-[#1A1A1A] text-base font-normal font-['Montserrat',sans-serif] focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-left leading-none"
                    />
                    <span className="text-[#8B8B8B] text-base font-normal font-['Montserrat',sans-serif] select-none leading-none">
                      {t("minutes of inactivity")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center -space-y-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, delayMinutes: prev.delayMinutes + 1 }))
                      }
                      className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-all duration-150 active:scale-90 cursor-pointer"
                      aria-label={t("Increase minutes")}
                    >
                      <ChevronUp className="size-4 stroke-[2]" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, delayMinutes: Math.max(5, prev.delayMinutes - 1) }))
                      }
                      className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-all duration-150 active:scale-90 cursor-pointer"
                      aria-label={t("Decrease minutes")}
                    >
                      <ChevronDown className="size-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Channels */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[16px] font-medium text-black font-['Montserrat',sans-serif]">
                  {t("Send via")}
                </span>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={form.channels.app}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, channels: { ...prev.channels, app: checked } }))
                      }
                    />
                    <span className="text-sm font-medium text-[#1A1A1A] font-['Montserrat',sans-serif]">
                      {t("App Notification")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={form.channels.whatsapp}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, channels: { ...prev.channels, whatsapp: checked } }))
                      }
                    />
                    <span className="text-sm font-medium text-[#1A1A1A] font-['Montserrat',sans-serif]">
                      {t("WhatsApp")}
                    </span>
                  </label>
                </div>
              </div>

              {/* Separator */}
              <Separator className="bg-[#CACBD4]" />

              {/* Test Box */}
              <div className="p-6 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]/60 transition-colors duration-200 rounded-2xl border-2 border-dashed border-[#624F1C] flex flex-col gap-4">
                <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {t(
                    "Try this notification on one number (yours) before sending to everyone"
                  )}
                </div>
                <div className="h-12 px-3.5 bg-white rounded-xl border border-[#CACBD4] focus-within:border-primary flex items-center transition-colors">
                  <input
                    type="text"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="01XXXXXXXX"
                    className="w-full bg-transparent text-[#1A1A1A] placeholder:text-[#8B8B8B] text-[16px] font-normal font-['Montserrat',sans-serif] focus:outline-none"
                  />
                </div>
                <DefaultButton
                  data={{
                    buttonText: isSendingTest
                      ? t("Sending...")
                      : t("Send Test"),
                    variant: "outline",
                    type: "button",
                    onClick: handleSendTest,
                    disabled: isSendingTest,
                    className:
                      "w-full h-10 rounded-[5px] border-primary text-primary hover:bg-[#F5F0EA] hover:text-primary font-['Montserrat',sans-serif] text-xs font-semibold transition-all duration-200 hover:shadow-2xs active:scale-[0.99]",
                  }}
                />
              </div>

              {/* Info Banner */}
              <div className="p-2 bg-[#F0F0F2] rounded-[10px] flex items-center gap-2">
                <Info className="size-3.5 text-black shrink-0" />
                <span className="text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight">
                  {t("Changes apply to future reminders — checked every minute by the server.")}
                </span>
              </div>

              {/* Enabled Card with project's Switch */}
              <div className="px-6 py-4 bg-[#FAFAF7] rounded-2xl border border-[#CACBD4] flex justify-between items-center transition-colors duration-200 hover:border-[#8F6900]/40">
                <span className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {t("Enabled")}
                </span>
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, enabled: checked }))
                  }
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-white px-6 pb-6 sm:px-7 sm:pb-7">
            <Separator className="mb-5 bg-[#CACBD4]" />
            <div className="flex justify-end items-center gap-4">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: onClose,
                  className:
                    "h-12 sm:h-14 px-7 py-4 rounded-[5px] border-primary text-primary hover:bg-white hover:text-primary font-['Montserrat',sans-serif] font-semibold text-base transition-all duration-200 hover:shadow-xs active:scale-[0.98]",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                disabled={isSaving}
                className="flex h-12 sm:h-14 cursor-pointer items-center justify-center rounded-[5px] px-7 py-4 text-base font-semibold text-white font-['Montserrat',sans-serif] transition-all duration-200 hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? t("Saving...") : t("Save changes")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
