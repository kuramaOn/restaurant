import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from './tables.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TablesService', () => {
  let service: TablesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    table: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a table', async () => {
      const createTableDto = {
        tableNumber: 5,
        capacity: 4,
        location: 'Main Hall',
      };

      const createdTable = {
        id: 'table-1',
        ...createTableDto,
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.table.create.mockResolvedValue(createdTable);

      const result = await service.create(createTableDto as any);

      expect(mockPrismaService.table.create).toHaveBeenCalledWith({
        data: {
          ...createTableDto,
          status: 'AVAILABLE',
        },
      });
      expect(result).toEqual(createdTable);
    });

    it('should set default status to AVAILABLE', async () => {
      const createTableDto = {
        tableNumber: 5,
        capacity: 4,
      };

      mockPrismaService.table.create.mockResolvedValue({
        id: 'table-1',
        ...createTableDto,
        status: 'AVAILABLE',
      });

      await service.create(createTableDto as any);

      expect(mockPrismaService.table.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'AVAILABLE',
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all tables', async () => {
      const tables = [
        { id: 'table-1', tableNumber: 1, capacity: 4 },
        { id: 'table-2', tableNumber: 2, capacity: 2 },
      ];

      mockPrismaService.table.findMany.mockResolvedValue(tables);

      const result = await service.findAll();

      expect(mockPrismaService.table.findMany).toHaveBeenCalled();
      expect(result).toEqual(tables);
    });

    it('should include active orders', async () => {
      mockPrismaService.table.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPrismaService.table.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            orders: expect.any(Object),
          }),
        })
      );
    });

    it('should order tables by tableNumber', async () => {
      mockPrismaService.table.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPrismaService.table.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { tableNumber: 'asc' },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return table by id', async () => {
      const tableId = 'table-1';
      const table = {
        id: tableId,
        tableNumber: 5,
        capacity: 4,
      };

      mockPrismaService.table.findUnique.mockResolvedValue(table);

      const result = await service.findOne(tableId);

      expect(mockPrismaService.table.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
        include: expect.any(Object),
      });
      expect(result).toEqual(table);
    });

    it('should return null if table not found', async () => {
      mockPrismaService.table.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update table', async () => {
      const tableId = 'table-1';
      const updateDto = {
        capacity: 6,
        location: 'Patio',
      };

      const updatedTable = {
        id: tableId,
        tableNumber: 5,
        ...updateDto,
      };

      mockPrismaService.table.update.mockResolvedValue(updatedTable);

      const result = await service.update(tableId, updateDto as any);

      expect(mockPrismaService.table.update).toHaveBeenCalledWith({
        where: { id: tableId },
        data: expect.objectContaining(updateDto),
      });
      expect(result).toEqual(updatedTable);
    });
  });

  describe('updateStatus', () => {
    it('should update table status', async () => {
      const tableId = 'table-1';
      const status = 'OCCUPIED';

      const updatedTable = {
        id: tableId,
        tableNumber: 5,
        status,
      };

      mockPrismaService.table.update.mockResolvedValue(updatedTable);

      const result = await service.updateStatus(tableId, status);

      expect(mockPrismaService.table.update).toHaveBeenCalledWith({
        where: { id: tableId },
        data: { status },
      });
      expect(result.status).toBe(status);
    });
  });

  describe('delete', () => {
    it('should delete table', async () => {
      const tableId = 'table-1';
      const deletedTable = {
        id: tableId,
        tableNumber: 5,
      };

      mockPrismaService.table.delete.mockResolvedValue(deletedTable);

      const result = await service.delete(tableId);

      expect(mockPrismaService.table.delete).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toEqual(deletedTable);
    });
  });

  describe('getQRCode', () => {
    it('should generate QR code data for table', async () => {
      const tableId = 'table-1';
      const table = {
        id: tableId,
        tableNumber: 5,
        capacity: 4,
        status: 'AVAILABLE',
      };

      mockPrismaService.table.findUnique.mockResolvedValue(table);

      const result = await service.getQRCode(tableId);

      expect(mockPrismaService.table.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toHaveProperty('tableId', tableId);
      expect(result).toHaveProperty('tableNumber', 5);
      expect(result).toHaveProperty('qrUrl');
      expect(result).toHaveProperty('qrData');
      expect(result.qrUrl).toContain(`table=${tableId}`);
      expect(result.qrUrl).toContain(`tableNumber=${table.tableNumber}`);
    });

    it('should throw error if table not found', async () => {
      mockPrismaService.table.findUnique.mockResolvedValue(null);

      await expect(service.getQRCode('nonexistent')).rejects.toThrow('Table not found');
    });

    it('should include customer menu URL in QR data', async () => {
      const tableId = 'table-1';
      const table = {
        id: tableId,
        tableNumber: 5,
      };

      mockPrismaService.table.findUnique.mockResolvedValue(table);

      const result = await service.getQRCode(tableId);

      expect(result.qrUrl).toContain('localhost:3003');
    });
  });
});
