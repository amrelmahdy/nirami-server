import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, discountSchema } from './schemas/dicount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: discountSchema }])],
  providers: [DiscountsService],
  controllers: [DiscountsController]
})
export class DiscountsModule { }
