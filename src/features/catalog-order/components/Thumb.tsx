import { useState } from "react";

interface ThumbProps {
  src?: string;
  name: string;
}

/** 32x32 rounded thumbnail with an initial-letter fallback when the image is missing/broken. */
export const Thumb = ({ src, name }: ThumbProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="size-8 shrink-0 rounded-md border-[0.27px] border-[#E5E5E5] bg-[#F5F0EA] flex items-center justify-center text-[11px] font-semibold text-[#8F6900] transition-transform duration-200 group-hover:scale-105">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="size-8 shrink-0 rounded-md border-[0.27px] border-[#E5E5E5] bg-[#F5F0EA] object-cover pointer-events-none transition-transform duration-200 group-hover:scale-105"
    />
  );
};
