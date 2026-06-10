import { useRef } from "react";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface UploadDropzoneProps {
  /** Object URL of the currently selected image (image mode only). */
  value?: string;
  onSelect: (file: File, objectUrl: string) => void;
  title: string;
  hint: string;
  accept?: string;
  /** When true the dropzone only shows the prompt (no image preview). */
  fileOnly?: boolean;
  className?: string;
}

const UploadDropzone = ({
  value,
  onSelect,
  title,
  hint,
  accept = "image/png,image/jpeg",
  fileOnly = false,
  className,
}: UploadDropzoneProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file, URL.createObjectURL(file));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA4D] px-4 py-8 text-center",
          className,
        )}
      >
        {value && !fileOnly ? (
          <img
            src={value}
            alt="preview"
            className="h-40 w-full rounded-[8px] object-cover"
          />
        ) : (
          <>
            <FileUp className="size-7 text-[#000000]" />
            <span className="text-[14px] font-semibold text-[#28293D]">
              {t(title)}
            </span>
            <span className="text-[12px] text-[#8B8B8B]">{t(hint)}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

export default UploadDropzone;
