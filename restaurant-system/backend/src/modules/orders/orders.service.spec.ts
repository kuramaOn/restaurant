import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    orderItem: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const createOrderDto = {
        tableId: 'table-1',
        orderType: 'DINE_IN',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        items: [
          {
            menuItemId: 'item-1',
            quantity: 2,
            price: 10.99,
          },
        ],
      };

      const expectedOrder = {
        id: 'order-1',
        orderNumber: 'ORD-001',
        ...createOrderDto,
        totalAmount: 21.98,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.create.mockResolvedValue(expectedOrder);

      const result = await service.create(createOrderDto as any);

      expect(mockPrismaService.order.create).toHaveBeenCalled();
      expect(result).toEqual(expectedOrder);
    });

    it('should calculate total amount correctly', async () => {
      const createOrderDto = {
        tableId: 'table-1',
        orderType: 'DINE_IN',
        customerName: 'John Doe',
        items: [
          { menuItemId: 'item-1', quantity: 2, price: 10.00 },
          { menuItemId: 'item-2', quantity: 1, price: 15.50 },
        ],
      };

      mockPrismaService.order.create.mockImplementation((data) => {
        return Promise.resolve({
          id: 'order-1',
          ...data.data,
          totalAmount: 35.50, // 2*10 + 1*15.50
        });
      });

      await service.create(createOrderDto as any);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: expect.any(Number),
          }),
        })
      );
    });

    it('should set default status to PENDING', async () => {
      const createOrderDto = {
        tableId: 'table-1',
        orderType: 'DINE_IN',
        customerName: 'John Doe',
        items: [{ menuItemId: 'item-1', quantity: 1, price: 10.00 }],
      };

      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-1',
        status: 'PENDING',
      });

      await service.create(createOrderDto as any);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'PENDING',
          }),
        })
      );
    });

    it('should set payment status to UNPAID', async () => {
      const createOrderDto = {
        tableId: 'table-1',
        orderType: 'DINE_IN',
        customerName: 'John Doe',
        items: [{ menuItemId: 'item-1', quantity: 1, price: 10.00 }],
      };

      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-1',
        paymentStatus: 'UNPAID',
      });

      await service.create(createOrderDto as any);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            paymentStatus: 'UNPAID',
          }),
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [
        { id: 'order-1', orderNumber: 'ORD-001', totalAmount: 25.98 },
        { id: 'order-2', orderNumber: 'ORD-002', totalAmount: 35.50 },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll({});

      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should filter by status', async () => {
      const status = 'PENDING';

      mockPrismaService.order.findMany.mockResolvedValue([]);

      await service.findAll({ status });

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status,
          }),
        })
      );
    });

    it('should include order items and table info', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);

      await service.findAll({});

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            orderItems: expect.any(Object),
            table: true,
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return order by id', async () => {
      const orderId = 'order-1';
      const order = {
        id: orderId,
        orderNumber: 'ORD-001',
        totalAmount: 25.98,
      };

      mockPrismaService.order.findUnique.mockResolvedValue(order);

      const result = await service.findOne(orderId);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: expect.any(Object),
      });
      expect(result).toEqual(order);
    });

    it('should return null if order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const orderId = 'order-1';
      const updateDto = { status: 'CONFIRMED' };

      const updatedOrder = {
        id: orderId,
        status: 'CONFIRMED',
      };

      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(orderId, updateDto as any);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: updateDto.status },
        include: expect.any(Object),
      });
      expect(result.status).toBe('CONFIRMED');
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const orderId = 'order-1';
      const paymentStatus = 'PAID';
      const paymentMethod = 'CASH';

      mockPrismaService.order.update.mockResolvedValue({
        id: orderId,
        paymentStatus,
        paymentMethod,
      });

      const result = await service.updatePaymentStatus(orderId, paymentStatus, paymentMethod);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: {
          paymentStatus,
          paymentMethod,
        },
        include: expect.any(Object),
      });
      expect(result.paymentStatus).toBe('PAID');
      expect(result.paymentMethod).toBe('CASH');
    });

    it('should update payment status without method', async () => {
      const orderId = 'order-1';
      const paymentStatus = 'PAID';

      mockPrismaService.order.update.mockResolvedValue({
        id: orderId,
        paymentStatus,
      });

      await service.updatePaymentStatus(orderId, paymentStatus);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: {
          paymentStatus,
        },
        include: expect.any(Object),
      });
    });
  });

  describe('getKitchenOrders', () => {
    it('should return orders for kitchen display', async () => {
      const kitchenOrders = [
        { id: 'order-1', status: 'CONFIRMED' },
        { id: 'order-2', status: 'PREPARING' },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(kitchenOrders);

      const result = await service.getKitchenOrders();

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: expect.objectContaining({
              in: expect.arrayContaining(['PENDING', 'CONFIRMED', 'PREPARING']),
            }),
          }),
        })
      );
      expect(result).toEqual(kitchenOrders);
    });
  });
});
