import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersAdminController} from './orders.admin.controller';
import { OrdersService } from './orders.service';


@Module({
  imports: [PrismaModule],
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService],
})
export class OrdersModule {}