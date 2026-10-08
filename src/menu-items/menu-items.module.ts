import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsAdminController } from './menu-items.admin.controller';
import { MenuItemsService } from './menu-items.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CategoriesModule, PrismaModule],
  controllers: [MenuItemsController, MenuItemsAdminController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}