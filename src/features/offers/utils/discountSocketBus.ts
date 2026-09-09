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

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (err) {
    // Ignore BroadcastChannel errors in unsupported environments
  }
}

/** Broadcast discount event to WebSockets AND local BroadcastChannel across tabs */
export function broadcastDiscountEvent(
  eventName: string,
  payload: DiscountEventPayload
) {
  try {
    const socket = getSocket();
    socket.emit(eventName, payload);
    socket.emit("discount_request_updated", payload);
  } catch (e) {
    // Ignore socket emit errors
  }

  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ eventName, payload });
    }
  } catch (e) {
    // Ignore channel postMessage errors
  }
}

/** Subscribe to discount real-time events (Socket.IO + BroadcastChannel) */
export function subscribeDiscountEvents(
  handler: (eventName: string, payload: any) => void
): () => void {
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
    try {
      socket.offAny(onAnyHandler);
    } catch (e) {}
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", onChannelMessage);
    }
  };
}
