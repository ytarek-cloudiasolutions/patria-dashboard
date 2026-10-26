import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipient } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface RecipientListCardProps {
  recipients: Recipient[];
  onRemoveRecipient?: (id: string) => void;
  title?: string;
  className?: string;
}

export const RecipientListCard = ({
  recipients,
  onRemoveRecipient,
  className,
}: RecipientListCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "w-full p-3 bg-[#FAFAF7] rounded-[16px] border border-[#CACBD4] flex flex-col justify-start items-start gap-2 overflow-hidden",
        className
      )}
    >
      <div className="self-stretch px-0.5 py-1 flex flex-col justify-start items-start gap-2.5 max-h-[240px] overflow-y-auto">
        {recipients.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#8B8B8B] w-full font-['Montserrat',sans-serif]">
            {t("No recipients in this list.")}
          </div>
        ) : (
          recipients.map((rec, index) => (
            <div key={rec.id} className="self-stretch flex flex-col gap-2.5">
              {index > 0 && <div className="self-stretch h-px bg-[#CACBD4]" />}
              <div className="self-stretch flex justify-between items-center">
                <div className="text-black text-sm font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight truncate pr-2">
                  {rec.name}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="text-[#1A1A1A] text-xs font-medium font-['Montserrat',sans-serif] leading-3 tracking-tight">
                    {rec.phone || "01288716491"}
                  </div>
                  {onRemoveRecipient && (
                    <button
                      type="button"
                      onClick={() => onRemoveRecipient(rec.id)}
                      className="size-4.5 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      aria-label={t("Remove")}
                    >
                      <X className="size-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

