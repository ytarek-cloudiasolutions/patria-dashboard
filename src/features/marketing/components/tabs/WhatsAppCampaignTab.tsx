import { useState, useRef } from "react";
import {
  Users,
  Hash,
  Upload,
  Info,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import FileIcon from "@/assets/icons/file.svg";
import { cn } from "@/lib/utils";
import { AudienceSegmentCards } from "../common/AudienceSegmentCards";
import { GenderSelector } from "../common/GenderSelector";
import { CategoryInterestChips } from "../common/CategoryInterestChips";
import { AudienceSummaryBadges } from "../common/AudienceSummaryBadges";
import { RecipientListCard } from "../common/RecipientListCard";
import { INITIAL_RECIPIENTS } from "../../data";
import type {
  AudienceCriteria,
  Recipient,
  WhatsAppCampaignDraft,
  WhatsAppSourceMode,
} from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

export const WhatsAppCampaignTab = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<WhatsAppSourceMode>("audience");

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    inactiveDays: 30,
    gender: "all",
    interests: [],
  });

  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);

  const [draft, setDraft] = useState<WhatsAppCampaignDraft>({
    sourceMode: "audience",
    rawNumbers:
      "Omnia Maher Galal\n01288716491\nSohaila Desouki\n01288716491\nMohamed Bayoumi\n01288716491",
    message: "Hi {name}✋🏻\nWe have an offer today...",
    secondsDelay: 5,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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

  const handleRemoveRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRawNumbersChange = (text: string) => {
    setDraft((prev) => ({ ...prev, rawNumbers: text }));

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed: Recipient[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\+?\d[\d\s-]{7,}$/.test(line)) {
        parsed.push({
          id: `raw-${i}`,
          name: t("Customer"),
          phone: line,
        });
      } else {
        const nextLine = lines[i + 1];
        if (nextLine && /^\+?\d[\d\s-]{7,}$/.test(nextLine)) {
          parsed.push({
            id: `raw-${i}`,
            name: line,
            phone: nextLine,
          });
          i++;
        } else {
          parsed.push({
            id: `raw-${i}`,
            name: line,
            phone: "",
          });
        }
      }
    }

    if (parsed.length > 0) {
      setRecipients(parsed);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDraft((prev) => ({ ...prev, sheetFileName: file.name }));
      showSuccessToast(
        t("File '{name}' loaded with 12 parsed numbers.").replace(
          "{name}",
          file.name
        )
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setDraft((prev) => ({ ...prev, imageFile: file, imageUrl: url }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setDraft((prev) => ({ ...prev, imageFile: undefined, imageUrl: undefined }));
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSendCampaign = () => {
    if (!draft.message.trim()) {
      showErrorToast(t("Please write a campaign message."));
      return;
    }
    const sendCount = mode === "audience" ? deviceCount : recipients.length;
    if (sendCount === 0) {
      showErrorToast(t("No recipients selected."));
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showSuccessToast(
        t("WhatsApp campaign started for {count} customers!").replace(
          "{count}",
          String(sendCount)
        )
      );
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      {/* Left Column: Who? Targeting and Source (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-4 overflow-hidden">
        {/* "Who?" Selector Card */}
        <div className="self-stretch px-6 py-4 bg-[#FAFAF7] rounded-[16px] border border-[#CACBD4] flex flex-col justify-start items-start gap-4 overflow-hidden">
          <div className="inline-flex justify-center items-center gap-2">
            <span className="text-[#595959] text-[10px] font-bold font-['Montserrat',sans-serif] tracking-tight">
              {t("Who?")}
            </span>
          </div>

          <div className="self-stretch flex flex-col sm:flex-row justify-start items-stretch gap-4 sm:gap-6">
            {/* Mode 1: Customer Audience */}
            <button
              type="button"
              onClick={() => setMode("audience")}
              className={cn(
                "flex-1 sm:w-56 px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all",
                mode === "audience"
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-[#FAFAF7] outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="size-6 flex items-center justify-center">
                <Users
                  className={cn(
                    "size-5",
                    mode === "audience" ? "text-black" : "text-[#595959]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-center text-sm font-['Montserrat',sans-serif] leading-4 tracking-tight",
                  mode === "audience"
                    ? "text-black font-semibold"
                    : "text-black font-medium"
                )}
              >
                {t("Customer Audience")}
              </span>
            </button>

            {/* Mode 2: Type Numbers */}
            <button
              type="button"
              onClick={() => setMode("numbers")}
              className={cn(
                "flex-1 px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all",
                mode === "numbers"
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-[#FAFAF7] outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="size-6 flex items-center justify-center">
                <Hash
                  className={cn(
                    "size-5",
                    mode === "numbers" ? "text-black" : "text-[#595959]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-center text-sm font-['Montserrat',sans-serif] leading-4 tracking-tight",
                  mode === "numbers"
                    ? "text-black font-semibold"
                    : "text-black font-medium"
                )}
              >
                {t("Type Numbers")}
              </span>
            </button>

            {/* Mode 3: From a sheet */}
            <button
              type="button"
              onClick={() => setMode("sheet")}
              className={cn(
                "flex-1 px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all",
                mode === "sheet"
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-[#FAFAF7] outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="size-6 flex items-center justify-center">
                <img
                  src={FileIcon}
                  alt="From a sheet"
                  className={cn(
                    "w-4 h-5 object-contain",
                    mode !== "sheet" && "opacity-70"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-center text-sm font-['Montserrat',sans-serif] leading-4 tracking-tight",
                  mode === "sheet"
                    ? "text-black font-semibold"
                    : "text-black font-medium"
                )}
              >
                {t("From a sheet")}
              </span>
            </button>
          </div>
        </div>

        {/* Content depending on selected mode */}
        {mode === "audience" && (
          <div className="self-stretch flex flex-col gap-4">
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

            {/* Audience Badges */}
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
        )}

        {mode === "numbers" && (
          <div className="self-stretch flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-sm font-semibold font-['Montserrat',sans-serif] text-[#1A1A1A]">
                {t("Enter recipients (Name and Phone)")}
              </label>
              <textarea
                rows={5}
                value={draft.rawNumbers}
                onChange={(e) => handleRawNumbersChange(e.target.value)}
                placeholder={t(
                  "One number per line, optionally with a name:\nSohaila Maher\n0123456789"
                )}
                className="w-full p-3.5 rounded-xl border border-[#CACBD4] bg-white text-xs font-['Montserrat',sans-serif] text-black focus:outline-none focus:border-[#8F6900] resize-none"
              />
              <span className="text-[11px] text-[#8B8B8B] font-['Montserrat',sans-serif]">
                {t("Duplicates are removed automatically.")}
              </span>
            </div>

            <div className="self-stretch h-px bg-[#CACBD4]" />

            <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {recipients.length} {t("Recipents")}
            </div>

            <RecipientListCard
              recipients={recipients}
              onRemoveRecipient={handleRemoveRecipient}
            />
          </div>
        )}

        {mode === "sheet" && (
          <div className="self-stretch flex flex-col gap-4 animate-in fade-in duration-150">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv, .xlsx, .xls"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="self-stretch p-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA]/30 flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer hover:bg-[#F5F0EA]/50 transition-colors"
            >
              <div className="size-6 flex items-center justify-center">
                <img
                  src={FileIcon}
                  alt="Upload sheet"
                  className="w-4 h-5 object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {draft.sheetFileName || t("Upload an Excel or CSV File")}
                </div>
                <div className="text-[#8B8B8B] text-xs font-normal font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {t(
                    "A phone column (mobile / phone), and optionally a name column"
                  )}
                </div>
              </div>
            </div>

            <div className="self-stretch h-px bg-[#CACBD4]" />

            <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {recipients.length} {t("Recipents")}
            </div>

            <RecipientListCard
              recipients={recipients}
              onRemoveRecipient={handleRemoveRecipient}
            />
          </div>
        )}
      </div>

      {/* Right Column: WhatsApp Message Composer (lg:col-span-5 xl:col-span-4) */}
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-stretch gap-4 overflow-hidden">
        {/* Title: Message */}
        <div className="self-stretch flex justify-start items-center">
          <h3 className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] tracking-tight">
            {t("Message")}
          </h3>
        </div>

        {/* Textarea */}
        <div className="self-stretch flex flex-col justify-start items-start">
          <textarea
            rows={4}
            value={draft.message}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Hi {name}✋🏻&#10;We have an offer today..."
            className="self-stretch px-3 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus:outline-[#8F6900] text-[#1A1A1A] text-xs font-normal font-['Montserrat',sans-serif] resize-none leading-relaxed placeholder:text-[#8B8B8B]"
          />
        </div>

        {/* Note / Info */}
        <div className="self-stretch p-2 bg-[#F3F4F6] rounded-[10px] flex justify-start items-center gap-2 overflow-hidden">
          <Info className="size-4 text-[#1A1A1A] shrink-0" />
          <div className="flex-1 text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight leading-4">
            {t(
              "{name} becomes each customer's name (\"Dear Customer\" when unknown)."
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Image (optional) */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex justify-start items-center">
            <span className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
              {t("Image")}{" "}
            </span>
            <span className="text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight ml-1">
              {t("(optional)")}
            </span>
          </div>

          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative self-stretch rounded-[16px] overflow-hidden border-2 border-dashed border-[#624F1C]">
              <img
                src={imagePreview}
                alt="Campaign Attachment"
                className="w-full h-36 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="self-stretch p-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA]/30 flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer hover:bg-[#F5F0EA]/50 transition-colors"
            >
              <div className="size-6 flex items-center justify-center">
                <img
                  src={FileIcon}
                  alt="Upload image"
                  className="w-4 h-5 object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {t("Click to upload image")}
                </div>
                <div className="text-[#8B8B8B] text-xs font-normal font-['Montserrat',sans-serif] leading-4 tracking-tight">
                  {t("PNG, JPG up to 5MB")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Delay Selector */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch text-black text-base font-medium font-['Montserrat',sans-serif]">
            {t("Seconds between each message")}
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch h-12 px-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] flex justify-between items-center gap-2 overflow-hidden">
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={draft.secondsDelay}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setDraft((prev) => ({
                      ...prev,
                      secondsDelay: isNaN(val) ? 1 : Math.max(1, val),
                    }));
                  }}
                  style={{
                    width: `${Math.max(1, String(draft.secondsDelay).length)}ch`,
                  }}
                  className="p-0 m-0 border-0 text-[#1A1A1A] text-base font-normal font-['Montserrat',sans-serif] focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-left leading-none"
                />
                <span className="text-[#8B8B8B] text-base font-normal font-['Montserrat',sans-serif] select-none leading-none">
                  {t("seconds")}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center -space-y-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      secondsDelay: prev.secondsDelay + 1,
                    }))
                  }
                  className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label={t("Increase seconds")}
                >
                  <ChevronUp className="size-4 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      secondsDelay: Math.max(1, prev.secondsDelay - 1),
                    }))
                  }
                  className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label={t("Decrease seconds")}
                >
                  <ChevronDown className="size-4 stroke-[2]" />
                </button>
              </div>
            </div>
            <div className="self-stretch text-[#8B8B8B] text-xs font-normal font-['Roboto',sans-serif] leading-5 tracking-tight">
              {t("Slower sending lowers the chance WhatsApp blocks the number.")}
            </div>
          </div>
        </div>

        {/* Send Button (No separator before it per previous instruction) */}
        <button
          type="button"
          onClick={handleSendCampaign}
          disabled={isSending}
          className="self-stretch h-12 px-6 py-3.5 bg-[#8F6900] hover:bg-[#785700] rounded-[5px] inline-flex justify-center items-center gap-3 outline outline-1 outline-offset-[-1px] outline-[#8F6900] text-white text-base font-semibold font-['Montserrat',sans-serif] leading-6 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
        >
          {isSending
            ? t("Starting campaign...")
            : t("Send to {count} Customers").replace(
                "{count}",
                String(mode === "audience" ? deviceCount : recipients.length)
              )}
        </button>
      </div>
    </div>
  );
};

