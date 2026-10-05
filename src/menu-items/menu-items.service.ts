import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService} from '../categories/categories.service';

@Injectable()
export class MenuItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateMenuItemDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId }
    })

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      return await this.prisma.menuItem.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          imageUrl: dto.imageUrl,
          isAvailable: dto.isAvailable ?? true,
          categoryId: dto.categoryId,
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Menu item is already in use');
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id}
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    const data = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    await this.findOne(id);
    if (dto.categoryId !== undefined) {
      await this.categoriesService.findOne(dto.categoryId);
    }

    try {
      return await this.prisma.menuItem.update({
        where: {id},
        data
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Menu item name is already in use');
      }

      throw error;
    }
  }

  async toggle(id: string) {
    const menuItem = await this.findOne(id);

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !menuItem.isAvailable }
    })
  }
}