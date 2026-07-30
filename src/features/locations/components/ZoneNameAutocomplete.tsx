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
        const name = place.name || place.formatted_address || "";
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

  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-2.5 text-[16px] font-medium text-black">
        {label}
        {required && <span className="text-[#C90000]">*</span>}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        required={required}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className={cn(
          "h-12.5 px-4.5 py-3 rounded-xl border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
        )}
      />
    </div>
  );
};

export default ZoneNameAutocomplete;
