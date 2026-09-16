import { useEffect, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import { loadGoogleMaps } from "@/shared/utils/googleMaps";

interface PlaceResult {
  name: string;
  lat?: number;
  lng?: number;
}

interface ZoneNameAutocompleteProps {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceResult) => void;
}

// Google Places Autocomplete on the zone-name field — mirrors ERB's Zones
// page, where picking a suggestion fills the name and captures the zone's
// center lat/lng (used to seed the map / potential future geofencing),
// instead of the cashier free-typing an area name with no standardization.
const ZoneNameAutocomplete = ({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  onPlaceSelect,
}: ZoneNameAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  onPlaceSelectRef.current = onPlaceSelect;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!apiKey || !inputRef.current) return;

    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !inputRef.current || !window.google?.maps?.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { fields: ["name", "formatted_address", "geometry"] },
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place) return;
        const name = place.name?.trim() || place.formatted_address?.trim() || "";
        const lat = place.geometry?.location?.lat?.();
        const lng = place.geometry?.location?.lng?.();
        // Keep the input's own DOM value as the source of truth instead of
        // letting a React re-render (from the onChange below) write back
        // into it — see the defaultValue/uncontrolled note below for why.
        if (inputRef.current) inputRef.current.value = name;
        onChangeRef.current(name);
        onPlaceSelectRef.current({ name, lat, lng });
      });
    });

    return () => {
      cancelled = true;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  // Google Places Autocomplete dropdown (.pac-container) is appended to document.body.
  // When inside a modal/dialog, we stop mousedown/pointerdown propagation from .pac-container
  // so document-level focus-trap / outside-click listeners don't blur the input or block selection.
  useEffect(() => {
    const attachPacListeners = () => {
      const containers = document.querySelectorAll<HTMLElement>(".pac-container");
      containers.forEach((container) => {
        if ((container as any)._hasPacFix) return;
        (container as any)._hasPacFix = true;

        const stopProp = (e: Event) => {
          e.stopPropagation();
        };

        container.addEventListener("pointerdown", stopProp);
        container.addEventListener("mousedown", stopProp);
        container.addEventListener("touchstart", stopProp);
      });
    };

    attachPacListeners();
    const observer = new MutationObserver(attachPacListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Google's Places widget mutates the input's DOM value directly (not via
  // a real keystroke event) whenever a suggestion is picked. If this input
  // stays React-controlled (`value={value}`), the very next render writes
  // `value` back into the DOM via React's native-setter path, which
  // desyncs Google's internal autocomplete state from what's actually in
  // the field — the first pick appears to work, but a second pick (same or
  // different suggestion) silently stops firing `place_changed`. Making
  // the field effectively uncontrolled (defaultValue + imperative sync)
  // avoids fighting Google's own DOM writes.
  const lastSyncedValue = useRef(value);
  useEffect(() => {
    if (value !== lastSyncedValue.current && inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
    lastSyncedValue.current = value;
  }, [value]);

  const geocodeAddress = (query: string) => {
    if (!query || !window.google?.maps?.Geocoder) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: query.includes("Egypt") ? query : `${query}, Alexandria, Egypt` },
      (results: any[], status: string) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          const lat = Number(loc.lat().toFixed(6));
          const lng = Number(loc.lng().toFixed(6));
          onPlaceSelectRef.current({ name: query, lat, lng });
        }
      }
    );
  };

  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-2 text-[12px] font-bold tracking-wider text-[#28293D] uppercase">
        {label}
        {required && <span className="text-[#C90000] ml-0.5">*</span>}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        required={required}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const text = inputRef.current?.value?.trim();
            if (text) geocodeAddress(text);
          }
        }}
        onBlur={(e) => {
          const text = e.target.value?.trim();
          if (text) geocodeAddress(text);
        }}
        autoComplete="off"
        className={cn(
          "h-12.5 px-4.5 py-3 rounded-xl border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
        )}
      />
    </div>
  );
};

export default ZoneNameAutocomplete;
