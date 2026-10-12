import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto} from './dto/add-cart-item.dto';
import { UpdateCartItemDto} from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                isAvailable: true,
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!cart) {
      return { id: null, items: [], totalAmount: 0 };
    }

    const items = cart.cartItems.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      menuItem: item.menuItem,
      subtotal: item.menuItem.price.toNumber() * item.quantity,
    }))

    const totalAmount = items.reduce((sum, item) =>
      sum + item.subtotal, 0);

    return {
      id: cart.id,
      items,
      totalAmount,
    }
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (!menuItem.isAvailable) {
      throw new BadRequestException('Menu item is not available');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId: dto.menuItemId,
        }
      }
    })

    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + dto.quantity, 99);

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: dto.menuItemId,
          quantity: Math.min(dto.quantity, 99)
        }
      })
    }

    return this.getCart(userId);
  }

  private async getOrCreateCart(userId: string) {
    const existing = await this.prisma.cart.findUnique({
      where: { userId },
    })

    if (existing) return existing;

    return this.prisma.cart.create({
      data: { userId }
    })
  }

  async updateItem(userId: string, cartItemId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId }
      },
    })

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: dto.quantity },
    })

    return this.getCart(userId);
  }

  async removeItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId }
      }
    })

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: {
        cart: { userId }
      }
    })

    return this.getCart(userId);
  }
}