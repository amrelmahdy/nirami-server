import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema }
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrderController]
})
export class OrdersModule { }
