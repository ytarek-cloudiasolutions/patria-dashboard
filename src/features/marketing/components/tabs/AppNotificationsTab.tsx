import { useState } from "react";
import { Tablet } from "lucide-react";
import { AudienceFilterCard } from "../common/AudienceFilterCard";
import type { AudienceCriteria, PushNotificationDraft } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

export const AppNotificationsTab = () => {
  const { t } = useTranslation();

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    inactiveDays: 30,
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

  // Dynamic audience sizing calculation based on filters
  const audienceBase =
    criteria.segment === "all"
      ? 398
      : criteria.segment === "inactive"
        ? 142
        : criteria.segment === "never_ordered"
          ? 96
          : criteria.segment === "recent"
            ? 178
            : 54;

  const genderMultiplier =
    criteria.gender === "all" ? 1 : criteria.gender === "women" ? 0.6 : 0.4;
  const interestMultiplier =
    criteria.interests.length > 0
      ? Math.max(0.15, 1 - criteria.interests.length * 0.12)
      : 1;

  const targetCount = Math.max(
    2,
    Math.round(audienceBase * genderMultiplier * interestMultiplier)
  );
  const deviceCount = Math.max(1, Math.round(targetCount * 0.7));
  const womenCount = Math.max(1, Math.round(targetCount * 0.8));
  const menCount = Math.max(1, targetCount - womenCount);

  const handleSendToAudience = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      showErrorToast(t("Please enter both a title and a message."));
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showSuccessToast(
        t("Notification sent successfully to {count} customers!").replace(
          "{count}",
          String(targetCount)
        )
      );
      setDraft((prev) => ({ ...prev, title: "", message: "" }));
    }, 1000);
  };

  const handleSendTest = () => {
    if (!draft.testPhone.trim()) {
      showErrorToast(t("Please enter a valid phone number."));
      return;
    }
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      showSuccessToast(
        t("Test notification sent successfully to {phone}").replace(
          "{phone}",
          draft.testPhone
        )
      );
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      {/* Left Column: Audience Targeting (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full">
        <AudienceFilterCard
          criteria={criteria}
          onCriteriaChange={setCriteria}
          customerCount={targetCount}
          deviceCount={deviceCount}
          womenCount={womenCount}
          menCount={menCount}
          className="w-full"
        />
      </div>

      {/* Right Column: Notification Message Card (lg:col-span-5 xl:col-span-4) */}
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col gap-4 overflow-hidden">
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
            className="w-full h-12 px-4 bg-white rounded-xl border border-[#CACBD4] text-[15px] placeholder:text-[#8C8C8C] text-black focus:outline-none focus:border-[#8F6900] font-['Montserrat',sans-serif]"
          />

          <input
            type="text"
            value={draft.message}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder={t("Message")}
            className="w-full h-12 px-4 bg-white rounded-xl border border-[#CACBD4] text-[15px] placeholder:text-[#8C8C8C] text-black focus:outline-none focus:border-[#8F6900] font-['Montserrat',sans-serif]"
          />
        </div>

        {/* Separator above preview card */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* In-Card Live Preview */}
        <div className="w-full p-5 bg-[#FAF9F5]/40 rounded-2xl border-2 border-[#624F1C] flex items-center gap-3.5">
          <div className="size-10 rounded-[12.658px] bg-[#F5F0EA] flex items-center justify-center shrink-0">
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
          className="w-full h-12 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] bg-[#8F6900] hover:bg-[#785700] text-white text-[15px] font-semibold font-['Montserrat',sans-serif] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSending
            ? t("Sending...")
            : t("Send to {count} Customers").replace(
                "{count}",
                String(targetCount)
              )}
        </button>

        {/* Separator below send button */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Test Send Notification Box */}
        <div className="self-stretch p-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA]/30 flex flex-col justify-center items-start gap-4 overflow-hidden">
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
              className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus:outline-[#8F6900] text-black text-base font-normal font-['Montserrat',sans-serif] placeholder:text-[#8C8C8C]"
            />
          </div>

          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSendingTest}
            className="self-stretch h-10 px-6 py-3 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] hover:bg-[#FAF6EB] inline-flex justify-center items-center gap-3 cursor-pointer transition-colors disabled:opacity-50"
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
