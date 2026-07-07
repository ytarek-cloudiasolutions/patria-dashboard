import { useEffect, useRef } from "react";
import type { Rider } from "../types";

interface GoogleMapProps {
  riders: Rider[];
  selectedRider: Rider | null;
  onSelectRider: (rider: Rider) => void;
}

declare global {
  interface Window {
    google: any;
    __gmaps_loading?: boolean;
    __gmaps_callbacks?: Array<() => void>;
  }
}

const STATUS_COLORS: Record<string, string> = {
  Active: "#22c55e",
  "On-Route": "#f97316",
  Delivered: "#9ca3af",
};

const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.maps) { resolve(); return; }
    if (!window.__gmaps_callbacks) window.__gmaps_callbacks = [];
    window.__gmaps_callbacks.push(resolve);
    if (window.__gmaps_loading) return;
    window.__gmaps_loading = true;
    (window as any).__gmaps_init = () => {
      window.__gmaps_callbacks?.forEach((cb) => cb());
      window.__gmaps_callbacks = [];
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmaps_init`;
    script.async = true;
    document.head.appendChild(script);
  });
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key || !containerRef.current) return;

    loadGoogleMaps(key).then(() => {
      if (!containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center: CAIRO_CENTER,
          zoom: 11,
          disableDefaultUI: false,
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
      const currentIds = new Set(riders.map((r) => r.id));
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
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

        let marker = markersRef.current.get(rider.id);
        if (!marker) {
          marker = new window.google.maps.Marker({
            position,
            map: mapRef.current,
            title: rider.name,
            icon,
          });
          marker.addListener("click", () => {
            onSelectRider(rider);
            infoWindowRef.current.setContent(
              `<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">
                <strong>${rider.name}</strong><br/>
                <span style="color:${color}">&#9679;</span> ${rider.status}<br/>
                <small>${rider.vehicleType} · ${rider.plateNumber}</small>
              </div>`
            );
            infoWindowRef.current.open(mapRef.current, marker);
          });
          markersRef.current.set(rider.id, marker);
        } else {
          marker.setPosition(position);
          marker.setIcon(icon);
        }
      });
    });
  }, [riders, onSelectRider]);

  // Pan to selected rider
  useEffect(() => {
    if (!mapRef.current || !selectedRider?.location) return;
    mapRef.current.panTo({ lat: selectedRider.location.lat, lng: selectedRider.location.lng });
    mapRef.current.setZoom(14);
    const marker = markersRef.current.get(selectedRider.id);
    if (marker && infoWindowRef.current) {
      const color = STATUS_COLORS[selectedRider.status] ?? "#9ca3af";
      infoWindowRef.current.setContent(
        `<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">
          <strong>${selectedRider.name}</strong><br/>
          <span style="color:${color}">&#9679;</span> ${selectedRider.status}<br/>
          <small>${selectedRider.vehicleType} · ${selectedRider.plateNumber}</small>
        </div>`
      );
      infoWindowRef.current.open(mapRef.current, marker);
    }
  }, [selectedRider]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[16px] border border-[#E5E5E5]">
      <div ref={containerRef} className="h-full w-full" />
      {riders.filter((r) => r.location).length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
          <div className="rounded-full border border-[#E5E5E5] bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-[12px] font-medium text-[#595959]">
              No driver locations available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
