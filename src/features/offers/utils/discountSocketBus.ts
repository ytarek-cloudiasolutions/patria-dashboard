import { getSocket } from "@/shared/lib/socket";

const BROADCAST_CHANNEL_NAME = "patria_discount_events_channel";

export interface DiscountEventPayload {
  request?: any;
  data?: any;
  status?: string;
  id?: string | null;
  _id?: string | null;
  [key: string]: any;
}

type DiscountEventHandler = (eventName: string, payload: any) => void;
const localSubscribers = new Set<DiscountEventHandler>();

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (err) {
    // Ignore BroadcastChannel errors in unsupported environments
  }
}

/** Broadcast discount event to in-tab listeners, WebSockets, AND BroadcastChannel across tabs */
export function broadcastDiscountEvent(
  eventName: string,
  payload: DiscountEventPayload
) {
  // 1. Immediately invoke local in-memory subscribers in the active window
  localSubscribers.forEach((handler) => {
    try {
      handler(eventName, payload);
    } catch (err) {
      console.error("Error in local discount event handler:", err);
    }
  });

  // 2. Dispatch window CustomEvent for cross-component isolation safety
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("patria_discount_event", {
          detail: { eventName, payload },
        })
      );
    } catch (err) {}
  }

  // 3. Emit to WebSockets
  try {
    const socket = getSocket();
    socket.emit(eventName, payload);
    socket.emit("discount_request_updated", payload);
  } catch (e) {
    // Ignore socket emit errors
  }

  // 4. Post to BroadcastChannel (other browser tabs)
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ eventName, payload });
    }
  } catch (e) {
    // Ignore channel postMessage errors
  }
}

/** Subscribe to discount real-time events (in-tab, Socket.IO, and BroadcastChannel) */
export function subscribeDiscountEvents(
  handler: (eventName: string, payload: any) => void
): () => void {
  // Register in-memory subscriber for events dispatched within the current tab
  localSubscribers.add(handler);

  // Window event listener fallback
  const onWindowEvent = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.eventName) {
      handler(customEvent.detail.eventName, customEvent.detail.payload);
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("patria_discount_event", onWindowEvent);
  }

  const socket = getSocket();

  // Listen to ALL socket events arriving from server
  const onAnyHandler = (eventName: string, ...args: any[]) => {
    const payload = args[0] || {};
    handler(eventName, payload);
  };

  socket.onAny(onAnyHandler);

  // Listen to BroadcastChannel messages across browser tabs
  const onChannelMessage = (event: MessageEvent) => {
    if (event.data?.eventName && event.data?.payload) {
      handler(event.data.eventName, event.data.payload);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", onChannelMessage);
  }

  return () => {
    localSubscribers.delete(handler);
    if (typeof window !== "undefined") {
      window.removeEventListener("patria_discount_event", onWindowEvent);
    }
    try {
      socket.offAny(onAnyHandler);
    } catch (e) {}
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", onChannelMessage);
    }
  };
}
