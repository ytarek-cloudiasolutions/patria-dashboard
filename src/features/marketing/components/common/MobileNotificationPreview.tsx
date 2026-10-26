import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface MobileNotificationPreviewProps {
  title: string;
  message: string;
  brandName?: string;
  timeAgo?: string;
  className?: string;
}

export const MobileNotificationPreview = ({
  title,
  message,
  brandName = "Patria",
  timeAgo = "Now",
  className,
}: MobileNotificationPreviewProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "rounded-[16px] border border-[#624F1C]/70 bg-[#FAF7F2]/50 p-4 transition-all shadow-2xs",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* App Icon Tile */}
        <div className="size-10 rounded-[12px] bg-[#F5F0EA] border border-[#E5E5E5] flex items-center justify-center shrink-0 text-[#8F6900]">
          <Smartphone className="size-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[10px] text-[#8B8B8B] font-medium mb-0.5">
            <span>
              {brandName} • {t(timeAgo)}
            </span>
          </div>
          <div className="text-[13px] font-semibold text-black leading-snug truncate">
            {title || t("Title")}
          </div>
          <div className="text-[11px] text-[#595959] font-normal leading-normal mt-0.5 line-clamp-2">
            {message || t("Message")}
          </div>
        </div>
      </div>
    </div>
  );
};
