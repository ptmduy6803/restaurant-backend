import { ApiPropertyOptional, } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateMenuItemDto {
  @ApiPropertyOptional({
    example: 'Margherita Pizza',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example:
      'A traditional Neapolitan pizza topped with tomato sauce and mozzarella cheese',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 100000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: "https://example.com/images/margherita-pizza.jpg",
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}