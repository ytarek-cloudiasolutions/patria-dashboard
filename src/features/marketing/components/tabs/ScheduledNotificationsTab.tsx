import { useCallback, useEffect, useState } from "react";
import { Clock, Tablet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudienceSegmentCards } from "../common/AudienceSegmentCards";
import { GenderSelector } from "../common/GenderSelector";
import { CategoryInterestChips } from "../common/CategoryInterestChips";
import { AudienceSummaryBadges } from "../common/AudienceSummaryBadges";
import DatePicker from "@/shared/components/DatePicker";
import {
  SetTimePickerModal,
  getFormattedLocalTime,
} from "../modals/SetTimePickerModal";
import marketingApi, { type AudienceSegmentCounts, type BackendGender, type MarketingCampaign } from "../../api/marketingApi";
import type { AudienceCriteria, ScheduledNotificationDraft } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Parses the "hh:mm AM/PM" format getFormattedLocalTime()/SetTimePickerModal
// produce into 24h { hours, minutes } for building a Date.
function parseDisplayTime(time: string): { hours: number; minutes: number } {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return { hours: 9, minutes: 0 };
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  return { hours, minutes };
}

function toBackendGender(gender: AudienceCriteria["gender"]): BackendGender {
  if (gender === "women") return "female";
  if (gender === "men") return "male";
  return "all";
}

export const ScheduledNotificationsTab = () => {
  const { t } = useTranslation();

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    gender: "all",
    interests: [],
  });
  const [segmentCounts, setSegmentCounts] = useState<AudienceSegmentCounts>();

  const today = new Date();
  const currentDate = toYmd(today);
  const currentTime = getFormattedLocalTime();

  const [draft, setDraft] = useState<ScheduledNotificationDraft>(() => ({
    frequency: "once",
    onceDate: currentDate,
    time: currentTime,
    title: "",
    message: "",
  }));

  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduled, setScheduled] = useState<MarketingCampaign[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  useEffect(() => {
    let cancelled = false;
    marketingApi
      .getAudienceSegments({ gender: toBackendGender(criteria.gender), interests: criteria.interests })
      .then((counts) => { if (!cancelled) setSegmentCounts(counts); })
      .catch((err) => console.error("Failed to load audience segment counts:", err));
    return () => { cancelled = true; };
  }, [criteria.gender, criteria.interests]);

  const targetCount = segmentCounts?.[criteria.segment];

  const fetchScheduled = useCallback(async () => {
    try {
      const campaigns = await marketingApi.getCampaigns({ status: "scheduled" });
      setScheduled(campaigns.sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime()));
    } catch (err) {
      console.error("Failed to load scheduled campaigns:", err);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchScheduled();
  }, [fetchScheduled]);

  const handleSchedule = async () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      showErrorToast(t("Please enter both a title and a message."));
      return;
    }
    if (!draft.onceDate) {
      showErrorToast(t("Please pick a date."));
      return;
    }

    const { hours, minutes } = parseDisplayTime(draft.time);
    const scheduledAt = new Date(draft.onceDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    if (scheduledAt.getTime() <= Date.now()) {
      showErrorToast(t("Please pick a time in the future."));
      return;
    }

    setIsScheduling(true);
    try {
      await marketingApi.sendAppNotification({
        title: draft.title.trim(),
        body: draft.message.trim(),
        segment: criteria.segment,
        gender: toBackendGender(criteria.gender),
        interests: criteria.interests,
        scheduledAt: scheduledAt.toISOString(),
      });
      showSuccessToast(
        t("Notification scheduled for {time} successfully!").replace("{time}", draft.time)
      );
      setDraft((prev) => ({ ...prev, title: "", message: "" }));
      fetchScheduled();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to schedule notification"));
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await marketingApi.cancelCampaign(id);
      setScheduled((prev) => prev.filter((c) => c._id !== id));
      showSuccessToast(t("Scheduled notification cancelled"));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to cancel"));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-in fade-in-50 duration-200">
      {/* Left Column: Audience Targeting + Upcoming list (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col gap-6">
        <div className="w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-4 overflow-hidden">
          {/* 6 Segments Cards */}
          <AudienceSegmentCards
            selectedSegment={criteria.segment}
            onSelectSegment={(segment) =>
              setCriteria((prev) => ({ ...prev, segment }))
            }
            counts={segmentCounts}
          />

          {/* Gender Selector */}
          <GenderSelector
            selectedGender={criteria.gender}
            onSelectGender={(gender) =>
              setCriteria((prev) => ({ ...prev, gender }))
            }
          />

          {/* Category Interests Chips */}
          <CategoryInterestChips
            selectedInterests={criteria.interests}
            onToggleInterest={(categoryId) =>
              setCriteria((prev) => ({
                ...prev,
                interests: prev.interests.includes(categoryId)
                  ? prev.interests.filter((c) => c !== categoryId)
                  : [...prev.interests, categoryId],
              }))
            }
          />

          {/* Separator before badges */}
          <div className="self-stretch h-px bg-[#CACBD4]" />

          {/* Summary Badge */}
          <AudienceSummaryBadges customerCount={targetCount} />
        </div>

        {/* Upcoming scheduled sends */}
        <div className="w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] flex flex-col gap-3">
          <h3 className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] tracking-tight">
            {t("Upcoming")}
          </h3>
          {isLoadingList ? (
            <div className="py-6 text-center text-xs text-[#8B8B8B]">{t("Loading...")}</div>
          ) : scheduled.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8B8B8B]">{t("No scheduled notifications.")}</div>
          ) : (
            <div className="flex flex-col divide-y divide-[#E5E5E5]">
              {scheduled.map((c) => (
                <div key={c._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-black truncate">{c.title || c.message}</div>
                    <div className="text-xs text-[#8B8B8B]">
                      {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : "-"} · {t(c.audience.segment)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancel(c._id)}
                    className="shrink-0 p-2 rounded-md text-[#C90000] hover:bg-[#FBE9E9] transition-colors"
                    aria-label={t("Cancel")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Notification Composer & Schedule (lg:col-span-5 xl:col-span-4) */}
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-stretch gap-4 overflow-hidden">
        {/* Title: Notification Message */}
        <div className="self-stretch flex justify-start items-center">
          <h3 className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] tracking-tight">
            {t("Notification Message")}
          </h3>
        </div>

        {/* Title and Message Inputs */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] transition-colors duration-200 flex justify-start items-center gap-3 overflow-hidden">
            <input
              type="text"
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder={t("Title")}
              className="w-full bg-transparent text-[#1A1A1A] placeholder:text-[#8B8B8B] text-base font-normal font-['Montserrat',sans-serif] focus:outline-none"
            />
          </div>

          <div className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] transition-colors duration-200 flex justify-start items-center gap-3 overflow-hidden">
            <input
              type="text"
              value={draft.message}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder={t("Message")}
              className="w-full bg-transparent text-[#1A1A1A] placeholder:text-[#8B8B8B] text-base font-normal font-['Montserrat',sans-serif] focus:outline-none"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Live Device Preview Card */}
        <div className="group self-stretch p-5 bg-[#FAF9F5]/40 rounded-2xl border-2 border-[#624F1C] flex items-center gap-3.5 overflow-hidden transition-all duration-200 hover:shadow-xs">
          <div className="size-10 rounded-[12.658px] bg-[#F5F0EA] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Tablet className="size-5 text-[#8F6900]" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[#8B8B8B] text-[10px] font-medium font-['Montserrat',sans-serif] leading-none mb-1">
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

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSchedule}
          disabled={isScheduling}
          className="self-stretch h-12 px-6 py-3.5 bg-[#8F6900] hover:bg-[#785700] rounded-[5px] inline-flex justify-center items-center gap-3 outline outline-1 outline-offset-[-1px] outline-[#8F6900] text-white text-base font-semibold font-['Montserrat',sans-serif] leading-6 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.99] shadow-xs disabled:opacity-50"
        >
          {isScheduling
            ? t("Scheduling...")
            : t("Schedule for {count} Customers").replace(
                "{count}",
                targetCount != null ? String(targetCount) : "…"
              )}
        </button>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Date Field — one-time only: the server has no recurrence/cron concept, so "everyday"/"certain weekday" aren't offered */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <span className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
            {t("Date")}
          </span>
          <DatePicker
            value={draft.onceDate || currentDate}
            onChange={(date) => setDraft((prev) => ({ ...prev, onceDate: date }))}
            placeholder="dd/MM/YYYY"
            buttonClassName="h-11 sm:h-12 rounded-xl border-[#CACBD4] text-sm text-[#1A1A1A] font-['Montserrat',sans-serif] focus:border-[#8F6900]"
            popoverPlacement="bottom-right"
            withBackdrop
          />
        </div>

        {/* Time (Cairo Time) Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-start">
              <span className="text-black text-base font-medium font-['Montserrat',sans-serif]">
                {t("Time")}{" "}
              </span>
              <span className="text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight">
                {t("(Cairo Time)")}
              </span>
            </div>
          </div>

          <div
            onClick={() => setIsTimePickerOpen(true)}
            className="group self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] hover:outline-[#8F6900] inline-flex justify-between items-center gap-3 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-2xs active:scale-[0.99]"
          >
            <div className="flex-1 text-[#1A1A1A] text-base font-normal font-['Montserrat',sans-serif]">
              {draft.time}
            </div>
            <Clock className="size-5 text-[#8B8B8B] transition-all duration-200 group-hover:scale-110 group-hover:text-[#8F6900]" />
          </div>
        </div>
      </div>

      {/* Time Picker Modal */}
      <SetTimePickerModal
        isOpen={isTimePickerOpen}
        initialTime={draft.time}
        onClose={() => setIsTimePickerOpen(false)}
        onSave={(time) => setDraft((prev) => ({ ...prev, time }))}
      />
    </div>
  );
};
