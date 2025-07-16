import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ReviewsModule } from '../reviews/reviews.module';
import { VariantsModule } from '../variants/variants.module';
import { Variant, variantSchema } from '../variants/schemas/variant.schema';
import { GroupsModule } from '../groups/groups.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    GroupsModule,
    ReviewsModule,
    VariantsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
