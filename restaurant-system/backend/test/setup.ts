import { PrismaClient } from '@prisma/client';

// Mock Prisma Client for testing
export const mockPrismaClient = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  menuItem: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  table: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

// Test data fixtures
export const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword123',
  role: 'CUSTOMER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testAdmin = {
  id: 'test-admin-id',
  email: 'admin@example.com',
  name: 'Admin User',
  password: 'hashedPassword123',
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testMenuItem = {
  id: 'test-item-id',
  name: 'Test Burger',
  description: 'Delicious test burger',
  price: 12.99,
  categoryId: 'test-category-id',
  imageUrl: 'https://example.com/burger.jpg',
  available: true,
  preparationTime: 15,
  spiceLevel: 0,
  calories: 500,
  dietaryTags: 'none',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testTable = {
  id: 'test-table-id',
  tableNumber: 5,
  capacity: 4,
  status: 'AVAILABLE',
  location: 'Main Hall',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testOrder = {
  id: 'test-order-id',
  orderNumber: 'ORD-001',
  customerId: 'test-user-id',
  tableId: 'test-table-id',
  status: 'PENDING',
  orderType: 'DINE_IN',
  totalAmount: 25.98,
  paymentStatus: 'UNPAID',
  paymentMethod: null,
  customerName: 'Test Customer',
  customerPhone: '+1234567890',
  specialInstructions: 'No onions',
  createdAt: new Date(),
  updatedAt: new Date(),
};
