import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(
    @MessageBody() data: { trackingCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data?.trackingCode) {
      const room = `order:${data.trackingCode}`;
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
      return { status: 'joined', room };
    }
  }

  @SubscribeMessage('joinDashboard')
  handleJoinDashboard(@ConnectedSocket() client: Socket) {
    client.join('dashboard');
    this.logger.log(`Client ${client.id} joined dashboard room`);
    return { status: 'joined', room: 'dashboard' };
  }

  /**
   * Broadcast order status update to customer tracking room, admin dashboard, and order list.
   */
  emitOrderStatusChanged(payload: {
    trackingCode: string;
    newStatus: string;
    newStatusLabel: string;
    note?: string;
    updatedAt: string;
  }) {
    const room = `order:${payload.trackingCode}`;
    this.server.to(room).emit('orderStatusUpdated', payload);
    this.server.to('dashboard').emit('orderStatusUpdated', payload);
    this.server.to('service-orders').emit('orderStatusUpdated', payload);
    this.logger.log(`Emitted orderStatusUpdated for ${payload.trackingCode} -> ${payload.newStatus}`);
  }

  /**
   * Broadcast quote decision (Approve/Reject) or Quote update.
   */
  emitQuoteUpdated(payload: {
    trackingCode: string;
    quoteStatus: string;
    orderStatus: string;
    actionBy: 'Customer' | 'Technician';
    message: string;
  }) {
    const room = `order:${payload.trackingCode}`;
    this.server.to(room).emit('quoteUpdated', payload);
    this.server.to('dashboard').emit('quoteUpdated', payload);
    this.server.to('service-orders').emit('quoteUpdated', payload);
    this.logger.log(`Emitted quoteUpdated for ${payload.trackingCode} -> ${payload.quoteStatus}`);
  }

  /**
   * Broadcast new order creation.
   */
  emitNewOrderCreated(payload: {
    trackingCode: string;
    customerName: string;
    deviceInfo: string;
    createdAt: string;
  }) {
    this.server.to('dashboard').emit('newOrderCreated', payload);
    this.server.to('service-orders').emit('newOrderCreated', payload);
    this.logger.log(`Emitted newOrderCreated for ${payload.trackingCode}`);
  }
}
