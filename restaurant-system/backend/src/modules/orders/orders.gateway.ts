import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Emit new order to all clients (kitchen display)
  notifyNewOrder(order: any) {
    this.server.emit('new_order', order);
  }

  // Emit order status update
  notifyOrderUpdate(orderId: string, status: string) {
    this.server.emit('order_updated', { orderId, status, timestamp: new Date() });
  }

  // Emit item status update
  notifyItemUpdate(orderId: string, itemId: string, status: string) {
    this.server.emit('item_updated', { orderId, itemId, status, timestamp: new Date() });
  }

  // Listen for updates from clients
  @SubscribeMessage('update_order_status')
  handleOrderStatusUpdate(client: Socket, payload: any) {
    this.notifyOrderUpdate(payload.orderId, payload.status);
    return { success: true };
  }
}
