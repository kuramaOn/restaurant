import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE'])
  status?: string;

  @IsOptional()
  @IsString()
  floorSection?: string;

  @IsOptional()
  @IsNumber()
  positionX?: number;

  @IsOptional()
  @IsNumber()
  positionY?: number;
}
