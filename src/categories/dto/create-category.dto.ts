import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Pizza',
    description: 'Category name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}