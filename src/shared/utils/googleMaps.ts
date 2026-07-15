declare global {
  interface Window {
    google: any;
    __gmaps_loading?: boolean;
    __gmaps_callbacks?: Array<() => void>;
  }
}

// Shared loader — always requests the `places` library so both the delivery
// map and any Places Autocomplete input can rely on a single script tag.
// Loading the script twice with different `libraries` params is unsafe, so
// every caller must go through this one function.
export function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.maps?.places) { resolve(); return; }
    if (!window.__gmaps_callbacks) window.__gmaps_callbacks = [];
    window.__gmaps_callbacks.push(resolve);
    if (window.__gmaps_loading) return;
    window.__gmaps_loading = true;
    (window as any).__gmaps_init = () => {
      window.__gmaps_callbacks?.forEach((cb) => cb());
      window.__gmaps_callbacks = [];
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmaps_init`;
    script.async = true;
    document.head.appendChild(script);
  });
}

export default loadGoogleMaps;
