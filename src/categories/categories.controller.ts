import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard} from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import {UpdateCategoryDto} from "./dto/update-category.dto";

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a category',
  })
  @ApiCreatedResponse({
    description: 'Category created',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiConflictResponse({
    description: 'Category name is already in use',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiOkResponse({
    description: 'Categories retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiOkResponse({
    description: 'Category updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiConflictResponse({
    description: 'Category name is already in use',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiOkResponse({
    description: 'Category deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiConflictResponse({
    description: 'Category has menu items and cannot be deleted',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.remove(id);
  }
}