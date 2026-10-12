import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'ID of the menu item to add',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({
    description: 'Quantity to add to cart',
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}