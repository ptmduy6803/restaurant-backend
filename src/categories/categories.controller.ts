import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiOkResponse({
    description: 'Categories retrieved successfully',
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}