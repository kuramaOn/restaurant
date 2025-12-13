import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, customerId, tableId, orderType, specialInstructions, customerName, customerPhone } = createOrderDto;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        customizations: item.customizations ? JSON.stringify(item.customizations) : null,
        specialInstructions: item.specialInstructions,
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Generate order number
    const orderCount = await this.prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        tableId,
        orderType: orderType as any,
        specialInstructions,
        customerName,
        customerPhone,
        subtotal,
        tax,
        total,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        table: true,
      },
    });

    return order;
  }

  async findAll(filters?: any) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.orderType) {
      where.orderType = filters.orderType;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        table: true,
      },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const data: any = {
      status: updateOrderStatusDto.status,
    };

    if (updateOrderStatusDto.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    });
  }

  async updateItemStatus(orderId: string, itemId: string, status: string) {
    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status: status as any },
    });
  }

  async getKitchenOrders() {
    return this.prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING'],
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(
    id: string, 
    paymentStatus: string, 
    paymentMethod?: string,
    tip?: number,
    amountReceived?: number
  ) {
    const updateData: any = { 
      paymentStatus: paymentStatus as any,
    };

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    if (tip !== undefined && tip > 0) {
      updateData.tip = tip;
      // Recalculate total with tip
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (order) {
        updateData.total = Number(order.subtotal) + Number(order.tax) - Number(order.discount) + tip;
      }
    }

    if (paymentStatus === 'PAID') {
      updateData.completedAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    });
  }
}
