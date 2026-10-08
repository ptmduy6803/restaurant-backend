import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('Menu Items - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/menu-items')
export class MenuItemsAdminController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a menu item',
  })
  @ApiCreatedResponse({
    description: 'Menu item created successfully',
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
    description: 'Menu item is already in use',
  })
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all menu item, including unavailable ones',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Menu items retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  findAllForAdmin(
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId?: string,
  ) {
    return this.menuItemsService.findAllForAdmin(categoryId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a menu item by id, including unavailable ones',
  })
  @ApiOkResponse({
    description: 'Menu item retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Menu item not found',
  })
  findOneForAdmin(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.menuItemsService.findOneForAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a menu item',
  })
  @ApiOkResponse({
    description: 'Menu item updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Menu item or category not found',
  })
  @ApiConflictResponse({
    description: 'Menu item name is already in use',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Toggle menu item availability',
  })
  @ApiOkResponse({
    description: 'Menu item availability toggled successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  @ApiNotFoundResponse({
    description: 'Menu item not found',
  })
  toggle(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.menuItemsService.toggle(id);
  }
}