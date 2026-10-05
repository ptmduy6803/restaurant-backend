import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class CategoriesService {
  constructor (
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category name is already in use');
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      }
    })
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const data = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    await this.findOne(id);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: data
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category name is already in use');
      }

      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    })

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.menuItems > 0) {
      throw new ConflictException('Cannot delete because it has menu items');
    }

    return this.prisma.category.delete({
      where: { id }
    })
  }
}