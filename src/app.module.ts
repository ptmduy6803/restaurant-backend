import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DecimalSerializerInterceptor } from './common/interceptors/decimal-serializer.interceptor';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule} from './menu-items/menu-items.module';
import { OrdersModule } from './order/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CartModule,
    CategoriesModule,
    MenuItemsModule,
    OrdersModule,
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DecimalSerializerInterceptor,
    }
  ],
})
export class AppModule {}
