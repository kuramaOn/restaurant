import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MenuService', () => {
  let service: MenuService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    menuItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
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
        MenuService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMenuItem', () => {
    it('should create a menu item', async () => {
      const createItemDto = {
        name: 'Burger',
        description: 'Delicious burger',
        price: 12.99,
        categoryId: 'cat-1',
        imageUrl: 'https://example.com/burger.jpg',
      };

      const createdItem = {
        id: 'item-1',
        ...createItemDto,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.menuItem.create.mockResolvedValue(createdItem);

      const result = await service.createMenuItem(createItemDto as any);

      expect(mockPrismaService.menuItem.create).toHaveBeenCalled();
      expect(result).toEqual(createdItem);
    });
  });

  describe('findAllMenuItems', () => {
    it('should return all menu items', async () => {
      const items = [
        { id: 'item-1', name: 'Burger', price: 12.99 },
        { id: 'item-2', name: 'Pizza', price: 15.99 },
      ];

      mockPrismaService.menuItem.findMany.mockResolvedValue(items);

      const result = await service.findAllMenuItems();

      expect(mockPrismaService.menuItem.findMany).toHaveBeenCalled();
      expect(result).toEqual(items);
    });

    it('should filter by categoryId', async () => {
      mockPrismaService.menuItem.findMany.mockResolvedValue([]);

      await service.findAllMenuItems({ categoryId: 'cat-1' });

      expect(mockPrismaService.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 'cat-1',
          }),
        })
      );
    });
  });

  describe('findOneMenuItem', () => {
    it('should return item by id', async () => {
      const itemId = 'item-1';
      const item = {
        id: itemId,
        name: 'Burger',
        price: 12.99,
      };

      mockPrismaService.menuItem.findUnique.mockResolvedValue(item);

      const result = await service.findOneMenuItem(itemId);

      expect(mockPrismaService.menuItem.findUnique).toHaveBeenCalledWith({
        where: { id: itemId },
        include: { category: true },
      });
      expect(result).toEqual(item);
    });

    it('should return null if item not found', async () => {
      mockPrismaService.menuItem.findUnique.mockResolvedValue(null);

      const result = await service.findOneMenuItem('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateMenuItem', () => {
    it('should update menu item', async () => {
      const itemId = 'item-1';
      const updateDto = {
        name: 'Updated Burger',
        price: 13.99,
      };

      const updatedItem = {
        id: itemId,
        ...updateDto,
      };

      mockPrismaService.menuItem.update.mockResolvedValue(updatedItem);

      const result = await service.updateMenuItem(itemId, updateDto as any);

      expect(mockPrismaService.menuItem.update).toHaveBeenCalled();
      expect(result).toEqual(updatedItem);
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete menu item', async () => {
      const itemId = 'item-1';
      const deletedItem = { id: itemId, name: 'Burger' };

      mockPrismaService.menuItem.delete.mockResolvedValue(deletedItem);

      const result = await service.deleteMenuItem(itemId);

      expect(mockPrismaService.menuItem.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
      expect(result).toEqual(deletedItem);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const createCategoryDto = {
        name: 'Burgers',
        description: 'All burger items',
      };

      const createdCategory = {
        id: 'cat-1',
        ...createCategoryDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.category.create.mockResolvedValue(createdCategory);

      const result = await service.createCategory(createCategoryDto as any);

      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryDto,
      });
      expect(result).toEqual(createdCategory);
    });
  });

  describe('findAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 'cat-1', name: 'Burgers' },
        { id: 'cat-2', name: 'Pizza' },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(categories);

      const result = await service.findAllCategories();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        include: {
          menuItems: true,
        },
      });
      expect(result).toEqual(categories);
    });

    it('should include menu items in category', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      await service.findAllCategories();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { menuItems: true },
        })
      );
    });
  });
});
