import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { FocusScope as FocusScopeModule } from "radix-ui/internal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AccentColorPickerProps {
  value: string;
  presets: string[];
  onChange: (color: string) => void;
  unavailableColors?: string[];
}

interface Hsv {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

const DEFAULT_SAVED = [
  "#EF4444", "#F97316", "#FACC15", "#4ADE80", "#2DD4BF", "#3B82F6", "#6366F1",
  "#EC4899", "#F43F5E", "#D946EF", "#8B5CF6", "#0EA5E9", "#10B981", "#84CC16",
];

const POPOVER_WIDTH = 256;
const POPOVER_HEIGHT = 400;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const UnavailableOverlay = () => (
  <span className="pointer-events-none absolute inset-0">
    <span className="absolute inset-[6.25%] rounded-full outline outline-2 -outline-offset-1 outline-neutral-300" />
    <span className="absolute left-1/2 top-1/2 h-[2px] w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-neutral-300" />
  </span>
);

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

const alphaFromHex = (hex: string): number => {
  const clean = hex.replace("#", "");
  if (clean.length !== 8) return 100;
  return Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100);
};

const withAlpha = (hex: string, alpha: number): string => {
  const base = hex.replace("#", "").slice(0, 6);
  return alpha >= 100 ? `#${base}` : `#${base}${hex2((alpha / 100) * 255)}`;
};

const AccentColorPicker = ({
  value,
  presets,
  onChange,
  unavailableColors = [],
}: AccentColorPickerProps) => {
  const { dir } = useTranslation();
  const [open, setOpen] = useState(false);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const isUnavailable = (color: string) =>
    unavailableColors.some((c) => c.toLowerCase() === color.toLowerCase());

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
      {presets.map((swatch) => {
        const unavailable = isUnavailable(swatch);
        return (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange(swatch)}
            disabled={unavailable}
            aria-label={swatch}
            className={cn(
              "relative size-7 rounded-full",
              unavailable ? "cursor-not-allowed" : "cursor-pointer",
            )}
            style={swatchStyle(swatch, value === swatch)}
          >
            {unavailable && <UnavailableOverlay />}
          </button>
        );
      })}

      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-label="Pick a custom color"
        className="size-7 cursor-pointer rounded-[4px]"
        style={
          isCustom
            ? { backgroundColor: value }
            : {
                background:
                  "conic-gradient(#F43F5E,#F59E0B,#EAB308,#22C55E,#0EA5E9,#A855F7,#F43F5E)",
              }
        }
      />

      {open &&
        createPortal(
          <>
            <div className="pointer-events-none fixed inset-0 z-[9998] bg-black/40" />
            <FocusScopeModule.FocusScope
              trapped
              onMountAutoFocus={(event: Event) => event.preventDefault()}
            >
              <div
                ref={portalRef}
                style={portalStyle}
                className="pointer-events-auto z-9999 flex h-96 w-64 flex-col gap-4 rounded-lg bg-white p-4 shadow-[0px_0px_6px_0px_rgba(31,41,55,0.05)] shadow-[0px_10px_15px_0px_rgba(31,41,55,0.10)]"
              >
                <ColorPicker
                  value={value}
                  onChange={onChange}
                  unavailableColors={unavailableColors}
                />
              </div>
            </FocusScopeModule.FocusScope>
          </>,
          document.body,
        )}
    </div>
  );
};

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  unavailableColors?: string[];
}

const ColorPicker = ({
  value,
  onChange,
  unavailableColors = [],
}: ColorPickerProps) => {
  const { t } = useTranslation();
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [alpha, setAlpha] = useState(() => alphaFromHex(value));
  const [alphaText, setAlphaText] = useState(() =>
    String(alphaFromHex(value)),
  );
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
    onChange(withAlpha(nextHex, alpha));
  };

  const applyAlpha = (nextAlpha: number, text?: string) => {
    const clamped = clamp(Math.round(nextAlpha), 0, 100);
    setAlpha(clamped);
    setAlphaText(text ?? String(clamped));
    onChange(withAlpha(hex, clamped));
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

  const handleHexBlur = () => {
    if (hexText.length === 3) {
      const full = hexText
        .split("")
        .map((c) => c + c)
        .join("");
      setHexText(full);
      commit(hexToHsv(`#${full}`));
    } else if (hexText.length !== 6) {
      setHexText(hex.replace("#", ""));
    }
  };

  const handleAlphaChange = (raw: string) => {
    const clean = raw.replace(/[^0-9]/g, "").slice(0, 3);
    if (clean === "") {
      setAlphaText("");
      return;
    }
    applyAlpha(Number(clean), clean);
  };

  const handleAlphaBlur = () => {
    applyAlpha(alphaText === "" ? 0 : Number(alphaText));
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Saturation / Value area */}
      <div
        ref={svRef}
        onPointerDown={dragFrom(svRef, (x, y) =>
          commit({ ...hsv, s: x, v: 1 - y }),
        )}
        className="relative min-h-0 w-full flex-1 cursor-crosshair rounded-sm"
        style={{ backgroundColor: hueColor }}
      >
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff, rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage: "linear-gradient(to top, #000, rgba(0,0,0,0))",
          }}
        />
        <span
          className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_4px_6px_0px_rgba(31,41,55,0.10)] shadow-[0px_2px_4px_0px_rgba(31,41,55,0.06)] outline outline-2 outline-offset-[-1px] outline-white"
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
        className="relative h-2 w-full cursor-pointer rounded-[100px]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)",
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_4px_6px_0px_rgba(31,41,55,0.10)] shadow-[0px_2px_4px_0px_rgba(31,41,55,0.06)] outline outline-2 outline-offset-[-1px] outline-white"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      {/* Opacity slider */}
      <div
        ref={alphaRef}
        onPointerDown={dragFrom(alphaRef, (x) => applyAlpha(x * 100))}
        className="relative h-2 w-full cursor-pointer rounded-[100px]"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
        }}
      >
        <div
          className="absolute inset-0 rounded-[100px]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0), ${hex})`,
          }}
        />
        <span
          className="pointer-events-none absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_4px_6px_0px_rgba(31,41,55,0.10)] shadow-[0px_2px_4px_0px_rgba(31,41,55,0.06)] outline outline-2 outline-offset-[-1px] outline-white"
          style={{ left: `${alpha}%`, backgroundColor: hex }}
        />
      </div>

      {/* Hex + opacity inputs */}
      <div className="flex w-full items-center gap-2">
        <div className="flex h-7 w-16 items-center gap-1 rounded-sm bg-white px-1.5 py-1 text-sm font-normal text-gray-700 shadow-[0px_1px_2px_0px_rgba(31,41,55,0.08)] outline outline-1 -outline-offset-1 outline-gray-200">
          {t("Hex")}
          <ChevronDown className="size-4 text-gray-400" />
        </div>
        <div className="flex h-7 min-w-0 flex-1 items-center gap-1 rounded-sm bg-white px-1.5 py-1 shadow-[0px_1px_2px_0px_rgba(31,41,55,0.08)] outline outline-1 -outline-offset-1 outline-gray-200">
          <span className="text-sm font-normal text-gray-400">#</span>
          <input
            value={hexText}
            onChange={(e) => handleHexChange(e.target.value)}
            onBlur={handleHexBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            maxLength={6}
            dir="ltr"
            className="w-full min-w-0 bg-transparent text-sm font-normal uppercase text-gray-700 outline-none"
          />
        </div>
        <div className="flex h-7 w-16 items-center gap-1 rounded-sm bg-white px-1.5 py-1 shadow-[0px_1px_2px_0px_rgba(31,41,55,0.08)] outline outline-1 -outline-offset-1 outline-gray-200">
          <input
            value={alphaText}
            onChange={(e) => handleAlphaChange(e.target.value)}
            onBlur={handleAlphaBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            maxLength={3}
            dir="ltr"
            className="w-full min-w-0 bg-transparent text-sm font-normal text-gray-700 outline-none"
          />
          <span className="text-sm font-normal text-gray-700">%</span>
        </div>
      </div>

      {/* Saved colors */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold leading-4 text-gray-700">
          {t("Saved colors")}:
        </span>
        <button
          type="button"
          onClick={() =>
            setSaved((prev) =>
              prev.includes(hex) ? prev : [...prev, hex],
            )
          }
          className="cursor-pointer text-xs font-semibold leading-4 text-gray-500"
        >
          + {t("Add")}
        </button>
      </div>
      <div className="grid w-full grid-cols-7 gap-2">
        {saved.map((color, index) => {
          const isSelected = hex.toLowerCase() === color.toLowerCase();
          const unavailable = unavailableColors.some(
            (c) => c.toLowerCase() === color.toLowerCase(),
          );
          return (
            <button
              key={`${color}-${index}`}
              type="button"
              onClick={() => commit(hexToHsv(color))}
              disabled={unavailable}
              aria-label={color}
              className={cn(
                "relative size-6 rounded-full",
                unavailable ? "cursor-not-allowed" : "cursor-pointer",
                isSelected &&
                  "shadow-[0px_0px_0px_2px_rgba(0,0,0,0.25)] outline outline-2 outline-white",
              )}
              style={{ backgroundColor: color }}
            >
              {unavailable && <UnavailableOverlay />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccentColorPicker;
