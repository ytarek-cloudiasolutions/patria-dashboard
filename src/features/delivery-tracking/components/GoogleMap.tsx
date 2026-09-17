import { useEffect, useRef } from "react";
import { Crosshair, MapPinOff } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import { loadGoogleMaps } from "@/shared/utils/googleMaps";

interface GoogleMapProps {
  riders: Rider[];
  selectedRider: Rider | null;
  onSelectRider: (rider: Rider) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Active: "#22c55e",
  "On-Route": "#f97316",
  Delivered: "#9ca3af",
};

const ALEXANDRIA_CENTER = { lat: 31.2001, lng: 29.9187 };

function makeMarkerIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.941 14 24 16 24s16-14.059 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
    <circle cx="16" cy="16" r="7" fill="white"/>
  </svg>`;
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(32, 40),
    anchor: new window.google.maps.Point(16, 40),
  };
}

const GoogleMap = ({ riders, selectedRider, onSelectRider }: GoogleMapProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string | number, any>>(new Map());
  const infoWindowRef = useRef<any>(null);
  const selectedRiderRef = useRef<Rider | null>(selectedRider);

  useEffect(() => {
    selectedRiderRef.current = selectedRider;
  }, [selectedRider]);

  const fitAllFleet = () => {
    if (!mapRef.current || !window.google?.maps) return;

    // All riders with valid coordinates
    const validRiders = riders.filter(
      (r) =>
        r.location &&
        typeof r.location.lat === "number" &&
        typeof r.location.lng === "number" &&
        !isNaN(r.location.lat) &&
        !isNaN(r.location.lng) &&
        (r.location.lat !== 0 || r.location.lng !== 0) &&
        r.location.lat >= 20 &&
        r.location.lat <= 33 &&
        r.location.lng >= 24 &&
        r.location.lng <= 37,
    );

    if (validRiders.length === 0) {
      mapRef.current.panTo(ALEXANDRIA_CENTER);
      mapRef.current.setZoom(12);
      return;
    }

    if (validRiders.length === 1) {
      focusRider(validRiders[0]);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    validRiders.forEach((r) => {
      bounds.extend(
        new window.google.maps.LatLng(r.location!.lat, r.location!.lng),
      );
    });

    mapRef.current.fitBounds(bounds, {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60,
    });

    // Only cap maximum zoom if all riders are extremely close (same branch/street)
    window.google.maps.event.addListenerOnce(mapRef.current, "idle", () => {
      if (!mapRef.current) return;
      if (mapRef.current.getZoom() > 15) {
        mapRef.current.setZoom(15);
      }
    });
  };

  const findMarker = (id: string | number) => {
    if (markersRef.current.has(id)) return markersRef.current.get(id);
    if (markersRef.current.has(String(id))) return markersRef.current.get(String(id));
    if (markersRef.current.has(Number(id))) return markersRef.current.get(Number(id));
    for (const [key, marker] of markersRef.current.entries()) {
      if (String(key) === String(id)) return marker;
    }
    return null;
  };

  const focusRider = (rider: Rider) => {
    if (!mapRef.current || !rider.location) return;

    const position = { lat: rider.location.lat, lng: rider.location.lng };
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(15);

    if (infoWindowRef.current) {
      const color = STATUS_COLORS[rider.status] ?? "#9ca3af";
      infoWindowRef.current.setContent(
        `<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">
          <strong>${rider.name}</strong><br/>
          <span style="color:${color}">&#9679;</span> ${rider.status}<br/>
          <small>${rider.vehicleType} · ${rider.plateNumber}</small>
        </div>`
      );

      const marker = findMarker(rider.id);
      if (marker) {
        try {
          infoWindowRef.current.open({
            anchor: marker,
            map: mapRef.current,
            shouldFocus: false,
          });
        } catch {
          infoWindowRef.current.open(mapRef.current, marker);
        }
      } else {
        infoWindowRef.current.setPosition(position);
        infoWindowRef.current.open(mapRef.current);
      }
    }
  };

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key || !containerRef.current) return;

    loadGoogleMaps(key).then(() => {
      if (!containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center: ALEXANDRIA_CENTER,
          zoom: 12,
          disableDefaultUI: false,
          gestureHandling: "greedy",
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });
        infoWindowRef.current = new window.google.maps.InfoWindow();
      }

      // Remove markers for riders no longer present
      const currentIds = new Set(riders.map((r) => String(r.id)));
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(String(id))) {
          marker.setMap(null);
          markersRef.current.delete(id);
        }
      });

      // Add / update markers
      riders.forEach((rider) => {
        if (!rider.location) return;
        const position = { lat: rider.location.lat, lng: rider.location.lng };
        const color = STATUS_COLORS[rider.status] ?? "#9ca3af";
        const icon = makeMarkerIcon(color);

        let marker = findMarker(rider.id);
        if (!marker) {
          marker = new window.google.maps.Marker({
            position,
            map: mapRef.current,
            title: rider.name,
            icon,
          });
          marker.addListener("click", () => {
            onSelectRider(rider);
            focusRider(rider);
          });
          markersRef.current.set(rider.id, marker);
        } else {
          marker.setPosition(position);
          marker.setIcon(icon);
        }
      });

      if (selectedRiderRef.current?.location) {
        focusRider(selectedRiderRef.current);
      } else {
        fitAllFleet();
      }
    });
  }, [riders, onSelectRider]);

  // Pan to selected rider and open info popup when selected externally, or fit all fleet when deselected
  useEffect(() => {
    if (!selectedRider) {
      infoWindowRef.current?.close();
      if (mapRef.current) {
        fitAllFleet();
      }
      return;
    }
    if (!mapRef.current) return;
    focusRider(selectedRider);
  }, [selectedRider]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[16px] border border-[#E5E5E5]">
      <div ref={containerRef} className="h-full w-full" />

      {/* Fit Fleet quick button */}
      <div className="absolute top-3 start-3 z-10">
        <button
          type="button"
          onClick={fitAllFleet}
          className="flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-[#28293D] shadow-sm backdrop-blur transition-all hover:border-[#8F6900]/40 hover:bg-[#FAFAF7] active:scale-95"
          title={t("Fit All Fleet")}
        >
          <Crosshair size={14} className="text-[#8F6900]" />
          <span>{t("Fit All Fleet")}</span>
        </button>
      </div>

      {/* Alert when selected rider has no live GPS coordinates */}
      {selectedRider && !selectedRider.location && (
        <div className="pointer-events-none absolute top-3 end-3 z-10 max-w-[280px]">
          <div className="flex items-center gap-2 rounded-xl border border-[#f97316]/30 bg-white/95 px-3 py-2 text-[12px] text-[#595959] shadow-sm backdrop-blur">
            <MapPinOff size={15} className="shrink-0 text-[#f97316]" />
            <span>
              <strong className="text-[#28293D]">{selectedRider.name}</strong>:{" "}
              {t("GPS signal is currently offline")}
            </span>
          </div>
        </div>
      )}

      {riders.filter((r) => r.location).length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
          <div className="rounded-full border border-[#E5E5E5] bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-[12px] font-medium text-[#595959]">
              {t("No driver locations available")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
