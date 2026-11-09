import { useEffect, useState } from "react";
import { Tablet } from "lucide-react";
import { AudienceFilterCard } from "../common/AudienceFilterCard";
import type { AudienceCriteria, PushNotificationDraft } from "../../types";
import marketingApi, { type AudienceSegmentCounts, type BackendGender } from "../../api/marketingApi";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

function toBackendGender(gender: AudienceCriteria["gender"]): BackendGender {
  if (gender === "women") return "female";
  if (gender === "men") return "male";
  return "all";
}

export const AppNotificationsTab = () => {
  const { t } = useTranslation();

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    gender: "all",
    interests: [],
  });

  const [draft, setDraft] = useState<PushNotificationDraft>({
    title: "",
    message: "",
    testPhone: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [segmentCounts, setSegmentCounts] = useState<AudienceSegmentCounts>();

  useEffect(() => {
    let cancelled = false;
    marketingApi
      .getAudienceSegments({ gender: toBackendGender(criteria.gender), interests: criteria.interests })
      .then((counts) => { if (!cancelled) setSegmentCounts(counts); })
      .catch((err) => console.error("Failed to load audience segment counts:", err));
    return () => { cancelled = true; };
  }, [criteria.gender, criteria.interests]);

  const targetCount = segmentCounts?.[criteria.segment];

  const handleSendToAudience = async () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      showErrorToast(t("Please enter both a title and a message."));
      return;
    }

    setIsSending(true);
    try {
      const campaign = await marketingApi.sendAppNotification({
        title: draft.title.trim(),
        body: draft.message.trim(),
        segment: criteria.segment,
        gender: toBackendGender(criteria.gender),
        interests: criteria.interests,
      });
      if (campaign.status === "failed") {
        showErrorToast(campaign.error || t("Failed to send notification"));
      } else {
        showSuccessToast(
          t("Notification sent successfully to {count} customers!").replace(
            "{count}",
            String(campaign.stats.targeted)
          )
        );
        setDraft((prev) => ({ ...prev, title: "", message: "" }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      showErrorToast(message || t("Failed to send notification"));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTest = async () => {
    if (!draft.testPhone.trim()) {
      showErrorToast(t("Please enter a valid phone number."));
      return;
    }
    setIsSendingTest(true);
    try {
      await marketingApi.testSend({
        channel: "app",
        phone: draft.testPhone.trim(),
        title: draft.title.trim() || "Test",
        message: draft.message.trim() || "Test notification",
      });
      showSuccessToast(
        t("Test notification sent successfully to {phone}").replace("{phone}", draft.testPhone)
      );
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to send test notification"));
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-in fade-in-50 duration-200">
      {/* Left Column: Audience Targeting (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full">
        <AudienceFilterCard
          criteria={criteria}
          onCriteriaChange={setCriteria}
          segmentCounts={segmentCounts}
          targetCount={targetCount}
          className="w-full"
        />
      </div>

      {/* Right Column: Notification Message Card (lg:col-span-5 xl:col-span-4) */}
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col gap-4 overflow-hidden">
        {/* Header Title */}
        <div>
          <h3 className="text-[#1A1A1A] text-[17px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
            {t("Notification Message")}
          </h3>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3.5 w-full">
          <input
            type="text"
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder={t("Title")}
            className="w-full h-12 px-4 bg-white rounded-xl border border-[#CACBD4] text-[15px] placeholder:text-[#8C8C8C] text-black focus:outline-none focus:border-[#8F6900] transition-colors duration-200 font-['Montserrat',sans-serif]"
          />

          <input
            type="text"
            value={draft.message}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder={t("Message")}
            className="w-full h-12 px-4 bg-white rounded-xl border border-[#CACBD4] text-[15px] placeholder:text-[#8C8C8C] text-black focus:outline-none focus:border-[#8F6900] transition-colors duration-200 font-['Montserrat',sans-serif]"
          />
        </div>

        {/* Separator above preview card */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* In-Card Live Preview */}
        <div className="group w-full p-5 bg-[#FAF9F5]/40 rounded-2xl border-2 border-[#624F1C] flex items-center gap-3.5 transition-all duration-200 hover:shadow-xs">
          <div className="size-10 rounded-[12.658px] bg-[#F5F0EA] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Tablet className="size-5 text-[#8F6900]" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[#8C8C8C] text-[10px] font-medium font-['Montserrat',sans-serif] leading-none mb-1">
              Patria • Now
            </span>
            <div className="text-black text-[13px] font-semibold font-['Montserrat',sans-serif] leading-tight truncate">
              {draft.title || t("Title")}
            </div>
            <div className="text-[#595959] text-[11px] font-normal font-['Montserrat',sans-serif] leading-normal line-clamp-2 mt-0.5">
              {draft.message || t("Message")}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendToAudience}
          disabled={isSending}
          className="w-full h-12 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] bg-[#8F6900] hover:bg-[#785700] text-white text-[15px] font-semibold font-['Montserrat',sans-serif] flex items-center justify-center transition-all duration-200 hover:shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {isSending
            ? t("Sending...")
            : t("Send to {count} Customers").replace(
                "{count}",
                targetCount != null ? String(targetCount) : "…"
              )}
        </button>

        {/* Separator below send button */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Test Send Notification Box */}
        <div className="self-stretch p-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA]/30 hover:bg-[#F5F0EA]/45 transition-colors duration-200 flex flex-col justify-center items-start gap-4 overflow-hidden">
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            <div className="flex-1 text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
              {t(
                "Try this notification on one number (yours) before sending to everyone"
              )}
            </div>
          </div>

          <div className="self-stretch h-12 flex flex-col justify-start items-start gap-2.5">
            <input
              type="text"
              value={draft.testPhone}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, testPhone: e.target.value }))
              }
              placeholder="01XXXXXXXX"
              className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus:outline-[#8F6900] transition-colors duration-200 text-black text-base font-normal font-['Montserrat',sans-serif] placeholder:text-[#8C8C8C]"
            />
          </div>

          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSendingTest}
            className="self-stretch h-10 px-6 py-3 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] hover:bg-[#FAF6EB] inline-flex justify-center items-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-2xs active:scale-[0.99] disabled:opacity-50"
          >
            <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat',sans-serif] leading-6">
              {isSendingTest ? t("Sending...") : t("Send Test")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
