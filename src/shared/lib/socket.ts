import { io, type Socket } from "socket.io-client";
import { ENV } from "@/config/env";

let socket: Socket | null = null;

/** Shared Socket.IO connection, created lazily on first use. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
