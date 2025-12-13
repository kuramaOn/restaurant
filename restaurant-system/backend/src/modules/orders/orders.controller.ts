import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersGateway: OrdersGateway,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    
    // Emit to kitchen display
    this.ordersGateway.notifyNewOrder(order);
    
    return order;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filters: any) {
    return this.ordersService.findAll(filters);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Get('kitchen')
  @UseGuards(JwtAuthGuard)
  getKitchenOrders() {
    return this.ordersService.getKitchenOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.ordersService.updateStatus(id, updateOrderStatusDto);
    
    // Emit status update
    this.ordersGateway.notifyOrderUpdate(id, updateOrderStatusDto.status);
    
    return order;
  }

  @Patch(':orderId/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateItemStatus(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body('status') status: string,
  ) {
    const item = await this.ordersService.updateItemStatus(orderId, itemId, status);
    
    // Emit item update
    this.ordersGateway.notifyItemUpdate(orderId, itemId, status);
    
    return item;
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { 
      paymentStatus: string; 
      paymentMethod?: string;
      tip?: number;
      amountReceived?: number;
    },
  ) {
    const order = await this.ordersService.updatePaymentStatus(
      id, 
      body.paymentStatus, 
      body.paymentMethod,
      body.tip,
      body.amountReceived
    );
    
    // Emit payment update
    this.ordersGateway.notifyOrderUpdate(id, order.status);
    
    return order;
  }
}
