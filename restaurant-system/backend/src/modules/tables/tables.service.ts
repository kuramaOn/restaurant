import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: {
        tableNumber: createTableDto.tableNumber,
        capacity: createTableDto.capacity,
        status: (createTableDto.status as any) || 'AVAILABLE',
        floorSection: createTableDto.floorSection,
        positionX: createTableDto.positionX,
        positionY: createTableDto.positionY,
      },
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id },
      data: {
        tableNumber: updateTableDto.tableNumber,
        capacity: updateTableDto.capacity,
        status: updateTableDto.status as any,
        floorSection: updateTableDto.floorSection,
        positionX: updateTableDto.positionX,
        positionY: updateTableDto.positionY,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.table.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async delete(id: string) {
    return this.prisma.table.delete({
      where: { id },
    });
  }

  async getQRCode(id: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new Error('Table not found');
    }

    // Generate QR code URL that points to customer menu with table parameter
    const baseUrl = process.env.CUSTOMER_MENU_URL || 'http://localhost:3003';
    const qrUrl = `${baseUrl}?table=${table.id}&tableNumber=${table.tableNumber}`;
    
    return {
      tableId: table.id,
      tableNumber: table.tableNumber,
      qrUrl,
      qrData: qrUrl, // This can be used to generate QR code image on frontend
    };
  }
}
