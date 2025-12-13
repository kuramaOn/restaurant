import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  // Menu Items
  async findAllMenuItems(filters?: any) {
    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.available !== undefined) {
      where.isAvailable = filters.available === 'true';
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    return this.prisma.menuItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneMenuItem(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
    const { allergens, dietaryTags, ...data } = createMenuItemDto;

    return this.prisma.menuItem.create({
      data: {
        ...data,
        allergens: allergens ? JSON.stringify(allergens) : null,
        dietaryTags: dietaryTags ? JSON.stringify(dietaryTags) : null,
      },
      include: {
        category: true,
      },
    });
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const { allergens, dietaryTags, ...data } = updateMenuItemDto;

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        allergens: allergens ? JSON.stringify(allergens) : undefined,
        dietaryTags: dietaryTags ? JSON.stringify(dietaryTags) : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
