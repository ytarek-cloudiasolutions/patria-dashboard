import { useEffect, useState, useRef } from "react";
import {
  Users,
  Hash,
  Info,
  X,
} from "lucide-react";
import FileIcon from "@/assets/icons/file.svg";
import { cn } from "@/lib/utils";
import { AudienceSegmentCards } from "../common/AudienceSegmentCards";
import { GenderSelector } from "../common/GenderSelector";
import { CategoryInterestChips } from "../common/CategoryInterestChips";
import { AudienceSummaryBadges } from "../common/AudienceSummaryBadges";
import { RecipientListCard } from "../common/RecipientListCard";
import marketingApi, { type AudienceSegmentCounts, type BackendGender } from "../../api/marketingApi";
import { sendWhatsAppBroadcast } from "@/features/offers/api/offersApi";
import type {
  AudienceCriteria,
  Recipient,
  WhatsAppCampaignDraft,
  WhatsAppSourceMode,
} from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

function toBackendGender(gender: AudienceCriteria["gender"]): BackendGender {
  if (gender === "women") return "female";
  if (gender === "men") return "male";
  return "all";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const WhatsAppCampaignTab = () => {
  const { t } = useTranslation();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<WhatsAppSourceMode>("audience");

  const [criteria, setCriteria] = useState<AudienceCriteria>({
    segment: "all",
    gender: "all",
    interests: [],
  });

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [segmentCounts, setSegmentCounts] = useState<AudienceSegmentCounts>();

  const [draft, setDraft] = useState<WhatsAppCampaignDraft>({
    sourceMode: "audience",
    rawNumbers: "",
    message: "",
    secondsDelay: 0,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (mode !== "audience") return;
    let cancelled = false;
    marketingApi
      .getAudienceSegments({ gender: toBackendGender(criteria.gender), interests: criteria.interests })
      .then((counts) => { if (!cancelled) setSegmentCounts(counts); })
      .catch((err) => console.error("Failed to load audience segment counts:", err));
    return () => { cancelled = true; };
  }, [mode, criteria.gender, criteria.interests]);

  const targetCount = segmentCounts?.[criteria.segment];

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

    setRecipients(parsed);
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

  const handleSendCampaign = async () => {
    if (!draft.message.trim()) {
      showErrorToast(t("Please write a campaign message."));
      return;
    }

    setIsSending(true);
    try {
      const image = draft.imageFile ? await fileToBase64(draft.imageFile) : undefined;

      if (mode === "audience") {
        const campaign = await marketingApi.sendWhatsappCampaign({
          message: draft.message.trim(),
          image,
          segment: criteria.segment,
          gender: toBackendGender(criteria.gender),
          interests: criteria.interests,
        });
        if (campaign.status === "failed") {
          showErrorToast(campaign.error || t("Failed to send campaign"));
        } else {
          showSuccessToast(
            t("WhatsApp campaign started for {count} customers!").replace(
              "{count}",
              String(campaign.stats.targeted)
            )
          );
          setDraft((prev) => ({ ...prev, message: "" }));
        }
        return;
      }

      const phones = recipients.map((r) => r.phone).filter(Boolean);
      if (phones.length === 0) {
        showErrorToast(t("No recipients selected."));
        return;
      }
      await sendWhatsAppBroadcast({ phones, message: draft.message.trim(), image });
      showSuccessToast(
        t("WhatsApp campaign started for {count} customers!").replace("{count}", String(phones.length))
      );
      setDraft((prev) => ({ ...prev, message: "" }));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErrorToast(message || t("Failed to send campaign"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-in fade-in-50 duration-200">
      {/* Left Column: Who? Targeting and Source (lg:col-span-7 xl:col-span-8) */}
      <div className="lg:col-span-7 xl:col-span-8 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-4 overflow-hidden">
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
                "group flex-1 sm:w-56 px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98]",
                mode === "audience"
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-[#FAFAF7] outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="size-6 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Users
                  className={cn(
                    "size-5 transition-colors duration-200",
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
                "group flex-1 px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98]",
                mode === "numbers"
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-[#FAFAF7] outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="size-6 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Hash
                  className={cn(
                    "size-5 transition-colors duration-200",
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
          </div>
        </div>

        {/* Content depending on selected mode */}
        {mode === "audience" && (
          <div className="self-stretch flex flex-col gap-4 animate-in fade-in-50 duration-200">
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

            {/* Audience Badge */}
            <AudienceSummaryBadges customerCount={targetCount} />
          </div>
        )}

        {mode === "numbers" && (
          <div className="self-stretch flex flex-col gap-4 animate-in fade-in-50 duration-200">
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
                className="w-full p-3.5 rounded-xl border border-[#CACBD4] bg-white text-xs font-['Montserrat',sans-serif] text-black focus:outline-none focus:border-[#8F6900] transition-colors duration-200 resize-none"
              />
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
      <div className="lg:col-span-5 xl:col-span-4 w-full p-6 bg-white rounded-[12px] border border-[#CACBD4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_14px_20px_-3px_rgba(0,0,0,0.12),0_6px_8px_-4px_rgba(0,0,0,0.10)] flex flex-col justify-start items-stretch gap-4 overflow-hidden">
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
            placeholder={t("We have an offer today...")}
            className="self-stretch px-3 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus:outline-[#8F6900] transition-colors duration-200 text-[#1A1A1A] text-xs font-normal font-['Montserrat',sans-serif] resize-none leading-relaxed placeholder:text-[#8B8B8B]"
          />
        </div>

        {/* Note / Info */}
        <div className="self-stretch p-2 bg-[#F3F4F6] rounded-[10px] flex justify-start items-center gap-2 overflow-hidden">
          <Info className="size-4 text-[#1A1A1A] shrink-0" />
          <div className="flex-1 text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight leading-4">
            {t("The server automatically paces sends with a randomized gap to avoid WhatsApp flagging the number — no manual delay needed.")}
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
            <div className="relative self-stretch rounded-[16px] overflow-hidden border-2 border-dashed border-[#624F1C] animate-in fade-in zoom-in-95 duration-200">
              <img
                src={imagePreview}
                alt="Campaign Attachment"
                className="w-full h-36 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all duration-150 hover:scale-110 active:scale-90 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="group self-stretch p-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA]/30 flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer hover:bg-[#F5F0EA]/50 transition-all duration-200 hover:shadow-xs active:scale-[0.99]"
            >
              <div className="size-6 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105">
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

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendCampaign}
          disabled={isSending}
          className="self-stretch h-12 px-6 py-3.5 bg-[#8F6900] hover:bg-[#785700] rounded-[5px] inline-flex justify-center items-center gap-3 outline outline-1 outline-offset-[-1px] outline-[#8F6900] text-white text-base font-semibold font-['Montserrat',sans-serif] leading-6 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.99] shadow-xs disabled:opacity-50"
        >
          {isSending
            ? t("Starting campaign...")
            : t("Send to {count} Customers").replace(
                "{count}",
                mode === "audience"
                  ? (targetCount != null ? String(targetCount) : "…")
                  : String(recipients.length)
              )}
        </button>
      </div>
    </div>
  );
};
