import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env';
import { IOrder } from '../models/Order';

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    // Admin joins admin room to receive all order events
    socket.on('admin:join', () => {
      socket.join('admin');
      console.log(`[Socket] Admin joined — ${socket.id}`);
    });

    // Customer subscribes to a specific order for live tracking
    socket.on('track:subscribe', (orderId: string) => {
      if (orderId && typeof orderId === 'string') {
        socket.join(`order:${orderId}`);
        console.log(`[Socket] Customer tracking ${orderId} — ${socket.id}`);
      }
    });

    socket.on('track:unsubscribe', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected — ${socket.id}`);
    });
  });

  console.log('✓ Socket.IO initialized');
  return io;
}

export const SocketService = {
  /** Notify admin room of a brand new incoming order */
  emitNewOrder(order: IOrder): void {
    if (!io) return;
    io.to('admin').emit('order:new', order);
  },

  /** Notify admin room + customer tracking room of status change */
  emitOrderUpdated(order: IOrder): void {
    if (!io) return;
    io.to('admin').emit('order:updated', order);
    io.to(`order:${order.orderId}`).emit('status:changed', {
      orderId: order.orderId,
      status: order.status,
      updatedAt: order.updatedAt,
    });
  },

  /** Notify admin room that an order was deleted */
  emitOrderDeleted(orderId: string): void {
    if (!io) return;
    io.to('admin').emit('order:deleted', { orderId });
  },
};
