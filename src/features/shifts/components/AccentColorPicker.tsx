import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AccentColorPickerProps {
  value: string;
  presets: string[];
  onChange: (color: string) => void;
}

interface Hsv {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

const DEFAULT_SAVED = [
  "#EF4444", "#F97316", "#FACC15", "#4ADE80", "#2DD4BF", "#3B82F6", "#6366F1",
  "#EC4899", "#FB7185", "#D946EF", "#A855F7", "#0EA5E9", "#10B981", "#84CC16",
];

const POPOVER_WIDTH = 256;
const POPOVER_HEIGHT = 400;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");

const hexToHsv = (hex: string): Hsv => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return { h: 0, s: 0, v: 0.5 };
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return { h: hue, s: max === 0 ? 0 : d / max, v: max };
};

const hsvToHex = ({ h, s, v }: Hsv): string => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];
  return `#${hex2((r + m) * 255)}${hex2((g + m) * 255)}${hex2((b + m) * 255)}`;
};

const AccentColorPicker = ({
  value,
  presets,
  onChange,
}: AccentColorPickerProps) => {
  const { dir } = useTranslation();
  const [open, setOpen] = useState(false);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const isCustom = !presets.includes(value);

  const calculatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const GAP = 8;
    const MARGIN = 8;
    const spaceBelow = window.innerHeight - rect.bottom - GAP - MARGIN;
    const top =
      spaceBelow >= POPOVER_HEIGHT
        ? rect.bottom + GAP
        : Math.max(MARGIN, window.innerHeight - POPOVER_HEIGHT - MARGIN);
    const horizontal: React.CSSProperties =
      dir === "rtl"
        ? { right: Math.max(MARGIN, window.innerWidth - rect.right) }
        : { left: Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - MARGIN) };
    setPortalStyle({ position: "fixed", top, ...horizontal });
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !portalRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleScroll = (event: Event) => {
      const target = event.target as Node | null;
      if (target && portalRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", calculatePosition);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", calculatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }
    calculatePosition();
    setOpen(true);
  };

  const swatchStyle = (color: string, selected: boolean): React.CSSProperties => ({
    backgroundColor: color,
    outline: selected ? `2px dashed ${color}` : undefined,
    outlineOffset: 2,
  });

  return (
    <div className="flex items-center gap-3">
      {presets.map((swatch) => (
        <button
          key={swatch}
          type="button"
          onClick={() => onChange(swatch)}
          aria-label={swatch}
          className="size-7 cursor-pointer rounded-full"
          style={swatchStyle(swatch, value === swatch)}
        />
      ))}

      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-label="Pick a custom color"
        className="size-7 cursor-pointer rounded-full"
        style={
          isCustom
            ? swatchStyle(value, true)
            : {
                background:
                  "conic-gradient(#F43F5E,#F59E0B,#EAB308,#22C55E,#0EA5E9,#A855F7,#F43F5E)",
              }
        }
      />

      {open &&
        createPortal(
          <div
            ref={portalRef}
            style={portalStyle}
            className="pointer-events-auto z-9999 w-64 overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white p-3 shadow-xl"
          >
            <ColorPicker value={value} onChange={onChange} />
          </div>,
          document.body,
        )}
    </div>
  );
};

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const { t } = useTranslation();
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [alpha, setAlpha] = useState(100);
  const [hexText, setHexText] = useState(value.replace("#", "").slice(0, 6));
  const [saved, setSaved] = useState<string[]>(DEFAULT_SAVED);

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const hex = hsvToHex(hsv);

  const commit = (next: Hsv) => {
    setHsv(next);
    const nextHex = hsvToHex(next);
    setHexText(nextHex.replace("#", ""));
    onChange(nextHex);
  };

  const dragFrom =
    (ref: React.RefObject<HTMLDivElement | null>, onMove: (x: number, y: number) => void) =>
    (event: React.PointerEvent) => {
      event.preventDefault();
      const handle = (clientX: number, clientY: number) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        onMove(
          clamp((clientX - rect.left) / rect.width, 0, 1),
          clamp((clientY - rect.top) / rect.height, 0, 1),
        );
      };
      handle(event.clientX, event.clientY);
      const move = (e: PointerEvent) => handle(e.clientX, e.clientY);
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    };

  const handleHexChange = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHexText(clean);
    if (clean.length === 6) commit(hexToHsv(`#${clean}`));
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  return (
    <div className="flex flex-col gap-3">
      {/* Saturation / Value area */}
      <div
        ref={svRef}
        onPointerDown={dragFrom(svRef, (x, y) =>
          commit({ ...hsv, s: x, v: 1 - y }),
        )}
        className="relative h-32 w-full cursor-crosshair rounded-[8px]"
        style={{ backgroundColor: hueColor }}
      >
        <div
          className="absolute inset-0 rounded-[8px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff, rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute inset-0 rounded-[8px]"
          style={{
            backgroundImage: "linear-gradient(to top, #000, rgba(0,0,0,0))",
          }}
        />
        <span
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: hex,
          }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        onPointerDown={dragFrom(hueRef, (x) => commit({ ...hsv, h: x * 360 }))}
        className="relative h-3 w-full cursor-pointer rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)",
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      {/* Opacity slider */}
      <div
        ref={alphaRef}
        onPointerDown={dragFrom(alphaRef, (x) => setAlpha(Math.round(x * 100)))}
        className="relative h-3 w-full cursor-pointer rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0), ${hex})`,
          }}
        />
        <span
          className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${alpha}%`, backgroundColor: hex }}
        />
      </div>

      {/* Hex + opacity inputs */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 items-center gap-1 rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] font-medium text-[#23252A]">
          {t("Hex")}
          <ChevronDown className="size-3.5 text-[#8B8B8B]" />
        </div>
        <div className="flex h-9 flex-1 items-center rounded-[8px] border border-[#E5E5E5] px-2">
          <span className="text-[13px] text-[#8B8B8B]">#</span>
          <input
            value={hexText}
            onChange={(e) => handleHexChange(e.target.value)}
            maxLength={6}
            dir="ltr"
            className="w-full bg-transparent text-[13px] uppercase text-[#23252A] outline-none"
          />
        </div>
        <div className="flex h-9 w-14 items-center rounded-[8px] border border-[#E5E5E5] px-2">
          <input
            value={alpha}
            onChange={(e) =>
              setAlpha(clamp(Number(e.target.value) || 0, 0, 100))
            }
            dir="ltr"
            className="w-full bg-transparent text-[13px] text-[#23252A] outline-none"
          />
          <span className="text-[13px] text-[#8B8B8B]">%</span>
        </div>
      </div>

      {/* Saved colors */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#333333]">
          {t("Saved colors")}:
        </span>
        <button
          type="button"
          onClick={() =>
            setSaved((prev) =>
              prev.includes(hex) ? prev : [...prev, hex],
            )
          }
          className="flex cursor-pointer items-center gap-1 text-[12px] font-medium text-primary"
        >
          <Plus className="size-3.5" />
          {t("Add")}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {saved.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            onClick={() => commit(hexToHsv(color))}
            aria-label={color}
            className={cn(
              "size-7 rounded-full",
              hex.toLowerCase() === color.toLowerCase() &&
                "ring-2 ring-[#6366F1] ring-offset-2",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default AccentColorPicker;
