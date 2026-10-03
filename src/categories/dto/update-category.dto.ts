import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Pizza Alternative',
    description: 'Category name',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name?: string;
}