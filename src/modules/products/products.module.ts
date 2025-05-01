import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schemas/product.schema';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: 'Product',  schema: productSchema} ]),
    ReviewsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
