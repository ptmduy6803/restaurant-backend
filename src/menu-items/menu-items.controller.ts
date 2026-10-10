import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@ApiTags('Menu Items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all menu items',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
  })
  @ApiOkResponse({
    description: 'Menu items retrieved successfully',
  })
  findAll(
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId?: string,
  ) {
    return this.menuItemsService.findAll(categoryId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a menu item by id',
  })
  @ApiOkResponse({
    description: 'Menu item retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Menu item not found',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.menuItemsService.findOne(id);
  }
}