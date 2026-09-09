import { io, type Socket } from "socket.io-client";
import { ENV } from "@/config/env";
import { getStoredAccessToken, getStoredUser } from "@/features/auth/utils/token";

let socket: Socket | null = null;
let lastToken: string | null = null;

/** Shared Socket.IO connection, created lazily on first use. */
export function getSocket(): Socket {
  const currentToken = getStoredAccessToken();

  // If token changed (e.g. user logged in after page load), recreate socket with new auth tokens
  if (socket && lastToken !== currentToken) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    lastToken = currentToken;
    const user = getStoredUser();

    socket = io(ENV.SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: {
        token: currentToken ? `Bearer ${currentToken}` : undefined,
        authorization: currentToken ? `Bearer ${currentToken}` : undefined,
        user,
      },
      query: {
        token: currentToken || undefined,
        userId: user?._id || user?.id || undefined,
        role: user?.role || undefined,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
    });

    socket.on("connect", () => {
      const updatedUser = getStoredUser();
      if (updatedUser) {
        socket?.emit("join", { userId: updatedUser._id || updatedUser.id, role: updatedUser.role });
        socket?.emit("authenticate", { token: currentToken, user: updatedUser });
        socket?.emit("register", { userId: updatedUser._id || updatedUser.id, role: updatedUser.role });
      }
    });
  }
  return socket;
}

/** Disconnect and cleanup the shared socket connection (e.g. on logout). */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

