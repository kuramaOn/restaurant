import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // Public endpoints
  @Get('categories')
  findAllCategories() {
    return this.menuService.findAllCategories();
  }

  @Get('items')
  findAllMenuItems(@Query() filters: any) {
    return this.menuService.findAllMenuItems(filters);
  }

  @Get('items/:id')
  findOneMenuItem(@Param('id') id: string) {
    return this.menuService.findOneMenuItem(id);
  }

  // Protected endpoints (Admin only)
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.menuService.createCategory(createCategoryDto);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard)
  updateMenuItem(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.deleteMenuItem(id);
  }

  @Patch('items/:id/availability')
  @UseGuards(JwtAuthGuard)
  toggleAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.menuService.toggleAvailability(id, isAvailable);
  }
}
