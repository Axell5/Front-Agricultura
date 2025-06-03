import { IsNotEmpty, IsNumber, IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total!: number;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  items!: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}