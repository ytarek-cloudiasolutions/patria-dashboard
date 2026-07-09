export const ENV = {
  API_URL: import.meta.env.VITE_API_URL,
  // Socket.IO connects to the server root, not the /api-prefixed REST base
  SOCKET_URL: import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, ""),
};
