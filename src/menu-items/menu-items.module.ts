import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CategoriesModule, PrismaModule],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}