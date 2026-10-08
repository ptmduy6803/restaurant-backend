import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriesController } from './categories.controller';
import { CategoriesAdminController } from './categories.admin.controller';
import { CategoriesService } from "./categories.service";

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}