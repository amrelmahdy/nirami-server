import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './schemas/product.schema';
import { ReviewsModule } from '../reviews/reviews.module';
import { VariantsModule } from '../variants/variants.module';
import { Variant, variantSchema } from '../variants/schemas/variant.schema';
import { GroupsModule } from '../groups/groups.module';
import { User, userSchema } from '../users/schemas/user.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: Variant.name, schema: variantSchema },
      { name: User.name, schema: userSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    GroupsModule,
    ReviewsModule,
    VariantsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
