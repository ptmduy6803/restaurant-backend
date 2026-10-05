import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Pizza Alternative',
    description: 'Category name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;
}