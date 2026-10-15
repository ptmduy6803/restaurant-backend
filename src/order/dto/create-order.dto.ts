import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Name of order receiver',
    example: 'Nguyen Van A'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  receiverName: string;

  @ApiProperty({
    description: 'Phone of order receiver',
    example: '0123456789'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  receiverPhone: string;

  @ApiProperty({
    description: 'Delivery location',
    example: '123 Road Street, Metropolis City'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  deliveryAddress: string;
}