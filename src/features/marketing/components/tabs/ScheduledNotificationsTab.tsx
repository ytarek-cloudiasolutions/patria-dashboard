import { useState } from "react";
import { Clock, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudienceSegmentCards } from "../common/AudienceSegmentCards";
import { GenderSelector } from "../common/GenderSelector";
import { CategoryInterestChips } from "../common/CategoryInterestChips";
import { AudienceSummaryBadges } from "../common/AudienceSummaryBadges";
import { RecipientListCard } from "../common/RecipientListCard";
import DatePicker from "@/shared/components/DatePicker";
import {
  SetTimePickerModal,
  getFormattedLocalTime,
} from "../modals/SetTimePickerModal";
import { INITIAL_RECIPIENTS } from "../../data";
import type {
  AudienceCriteria,
  Recipient,
  ScheduledNotificationDraft,
  ScheduleFrequency,
} from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const ScheduledNotificationsTab = () => {
  const { t } = useTranslation();

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    inactiveDays: 30,
    gender: "all",
    interests: [],
  });

  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);

  const today = new Date();
  const currentWeekday = WEEKDAYS[today.getDay()];
  const currentDate = toYmd(today);
  const currentTime = getFormattedLocalTime();

  const [draft, setDraft] = useState<ScheduledNotificationDraft>(() => ({
    frequency: "everyday",
    selectedWeekday: currentWeekday,
    onceDate: currentDate,
    time: currentTime,
    title: "",
    message: "",
  }));

  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // Dynamic audience sizing calculation matching Figma values
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

  const frequencies: { id: ScheduleFrequency; label: string }[] = [
    { id: "everyday", label: t("Everyday") },
    { id: "weekday", label: t("Certain Weekday") },
    { id: "once", label: t("Once") },
  ];

  const handleRemoveRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSchedule = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      showErrorToast(t("Please enter both a title and a message."));
      return;
    }

    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      showSuccessToast(
        t("Notification scheduled for {time} successfully!").replace(
          "{time}",
          draft.time
        )
      );
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      {/* Left Column: Audience Targeting (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-4 overflow-hidden">
        {/* 6 Segments Cards */}
        <AudienceSegmentCards
          selectedSegment={criteria.segment}
          onSelectSegment={(segment) =>
            setCriteria((prev) => ({ ...prev, segment }))
          }
          inactiveDays={criteria.inactiveDays}
          onInactiveDaysChange={(inactiveDays) =>
            setCriteria((prev) => ({ ...prev, inactiveDays }))
          }
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
          onToggleInterest={(category) =>
            setCriteria((prev) => ({
              ...prev,
              interests: prev.interests.includes(category)
                ? prev.interests.filter((c) => c !== category)
                : [...prev.interests, category],
            }))
          }
        />

        {/* Separator before badges */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Summary Badges */}
        <AudienceSummaryBadges
          customerCount={targetCount}
          deviceCount={deviceCount}
          womenCount={womenCount}
          menCount={menCount}
        />

        {/* Recipient Roster List */}
        <RecipientListCard
          recipients={recipients}
          onRemoveRecipient={handleRemoveRecipient}
        />
      </div>

      {/* Right Column: Notification Composer & Schedule (lg:col-span-5 xl:col-span-4) */}
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-stretch gap-4 overflow-hidden">
        {/* Title: Notification Message */}
        <div className="self-stretch flex justify-start items-center">
          <h3 className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] tracking-tight">
            {t("Notification Message")}
          </h3>
        </div>

        {/* Title and Message Inputs */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] flex justify-start items-center gap-3 overflow-hidden">
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

          <div className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] flex justify-start items-center gap-3 overflow-hidden">
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
        <div className="self-stretch p-5 bg-[#FAF9F5]/40 rounded-2xl border-2 border-[#624F1C] flex items-center gap-3.5 overflow-hidden">
          <div className="size-10 rounded-[12.658px] bg-[#F5F0EA] flex items-center justify-center shrink-0">
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

        {/* Action Button: Send to 8 Customers */}
        <button
          type="button"
          onClick={handleSchedule}
          disabled={isScheduling}
          className="self-stretch h-12 px-6 py-3.5 bg-[#8F6900] hover:bg-[#785700] rounded-[5px] inline-flex justify-center items-center gap-3 outline outline-1 outline-offset-[-1px] outline-[#8F6900] text-white text-base font-semibold font-['Montserrat',sans-serif] leading-6 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
        >
          {isScheduling
            ? t("Scheduling...")
            : t("Send to {count} Customers").replace(
                "{count}",
                String(deviceCount)
              )}
        </button>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Time Frequency Selector */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="w-32 inline-flex justify-start items-start gap-1">
            <span className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
              {t("Time")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-full">
            {frequencies.map((freq) => {
              const isSelected = draft.frequency === freq.id;
              return (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      frequency: freq.id,
                      selectedWeekday: prev.selectedWeekday || currentWeekday,
                      onceDate: prev.onceDate || currentDate,
                    }))
                  }
                  className={cn(
                    "w-full h-11 sm:h-12 px-1 rounded-[5px] outline outline-[1.50px] outline-offset-[-1.50px] flex items-center justify-center cursor-pointer transition-all overflow-hidden",
                    isSelected
                      ? "bg-[#F5F0EA] outline-[#8F6900] text-black font-semibold"
                      : "bg-[#FAFAF7] outline-[#CACBD4] text-black font-medium hover:outline-[#8F6900]/50"
                  )}
                >
                  <span className="text-center text-[11px] font-['Montserrat',sans-serif] leading-tight tracking-tight whitespace-nowrap">
                    {freq.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* If Certain Weekday is selected */}
          {draft.frequency === "weekday" && (
            <div className="flex flex-wrap gap-1.5 pt-1 w-full animate-in fade-in duration-150">
              {WEEKDAYS.map((day) => {
                const isSelected = draft.selectedWeekday === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, selectedWeekday: day }))
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-[5px] text-xs font-medium border transition-colors cursor-pointer font-['Montserrat',sans-serif]",
                      isSelected
                        ? "bg-[#8F6900] text-white border-[#8F6900]"
                        : "bg-white text-[#595959] border-[#CACBD4] hover:border-[#8F6900]"
                    )}
                  >
                    {t(day.slice(0, 3))}
                  </button>
                );
              })}
            </div>
          )}

          {/* If Once is selected */}
          {draft.frequency === "once" && (
            <div className="w-full pt-1 animate-in fade-in duration-150">
              <DatePicker
                value={draft.onceDate || currentDate}
                onChange={(date) =>
                  setDraft((prev) => ({ ...prev, onceDate: date }))
                }
                placeholder="dd/MM/YYYY"
                buttonClassName="h-11 sm:h-12 rounded-xl border-[#CACBD4] text-sm text-[#1A1A1A] font-['Montserrat',sans-serif] focus:border-[#8F6900]"
                popoverPlacement="bottom-right"
                withBackdrop
              />
            </div>
          )}
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
            className="self-stretch h-12 p-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] hover:outline-[#8F6900] inline-flex justify-between items-center gap-3 overflow-hidden cursor-pointer transition-colors"
          >
            <div className="flex-1 text-[#1A1A1A] text-base font-normal font-['Montserrat',sans-serif]">
              {draft.time}
            </div>
            <Clock className="size-5 text-[#8B8B8B]" />
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
