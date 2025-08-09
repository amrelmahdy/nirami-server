import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema }
    ]),
    CartModule,
    UsersModule
  ],
  controllers: [OrderController],
  providers: [OrdersService]
})
export class OrdersModule { }
