import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Margherita Pizza',
    description: 'Name of the dish',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example:
      'A traditional Neapolitan pizza topped with tomato sauce and mozzarella cheese',
    description: 'A brief introduction to the dish',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 100000,
    description: 'Cost of the dish',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    example: "https://example.com/images/margherita-pizza.jpg",
    description: 'Image of the dish',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the dish category',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Availability of dish',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}