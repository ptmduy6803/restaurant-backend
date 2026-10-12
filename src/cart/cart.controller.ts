import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart of the current user' })
  @ApiOkResponse({ description: 'Cart retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  getCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.getCart(user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a menu item to cart' })
  @ApiCreatedResponse({ description: 'Item added to cart' })
  @ApiBadRequestResponse({ description: 'Menu item is not available' })
  @ApiNotFoundResponse({ description: 'Menu item is not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.userId, dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiOkResponse({ description: 'Cart item updated successfully' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiOkResponse({ description: 'Cart item removed successfully' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.cartService.removeItem(user.userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  clearCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.clearCart(user.userId);
  }
}