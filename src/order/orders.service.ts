import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { OrderStatus} from '../generated/prisma/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          }
        }
      }
    }
  }
}>

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY],
  READY: [OrderStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  private buildOrderResponse(order: OrderWithItems) {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      items: order.orderItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
        menuItem: item.menuItem,
        subtotal: item.unitPrice.toNumber() * item.quantity,
      })),
    }
  }

  // ----- Public ----- //
  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            menuItem: true,
          }
        }
      }
    })

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const unavailable =
      cart.cartItems.find((item) => !item.menuItem.isAvailable);
    if (unavailable) {
      throw new BadRequestException(`Menu item "${unavailable.menuItem.name}" is not available`);
    }

    const itemsData = cart.cartItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.menuItem.price,
    }))

    const totalAmount = cart.cartItems.reduce(
      (sum, item) =>
        sum + item.menuItem.price.toNumber() * item.quantity,0
    )

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          receiverName: dto.receiverName,
          receiverPhone: dto.receiverPhone,
          deliveryAddress: dto.deliveryAddress,
        },
      });

      await tx.orderItem.createMany({
        data: itemsData.map((item) => ({
          ...item,
          orderId: newOrder.id,
        })),
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return this.findOne(userId, order.id);
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map((order) => this.buildOrderResponse(order));
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    })

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.buildOrderResponse(order);
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
    })

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: { status: OrderStatus.CANCELLED },
      include: {
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    })

    return this.buildOrderResponse(updatedOrder);
  }

  // ----- Admin ----- //
  async findAllForAdmin() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map((order) => ({
      ...this.buildOrderResponse(order),
      user: order.user
    }))
  }

  async findOneForAdmin(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      ...this.buildOrderResponse(order),
      user: order.user
    };
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const allowed = VALID_TRANSITIONS[order.status];

    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${dto.status}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId},
      data: { status: dto.status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    })

    return {
      ...this.buildOrderResponse(updatedOrder),
      user: updatedOrder.user
    };
  }
}