import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Returns a singleton Socket.IO client connection.
 * The URL defaults to the backend dev server; in production
 * Vite's proxy or the deployed backend URL handles routing.
 */
export function getSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
    socket = io(url, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
