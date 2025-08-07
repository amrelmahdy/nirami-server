import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './../../config/validation';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VariantsController } from '../variants/variants.controller';
import { VariantsModule } from '../variants/variants.module';
import { DepartmentsModule } from '../departments/departments.module';
import { CategoriesModule } from '../categories/categories.module';
import { GroupsModule } from '../groups/groups.module';
import { BrandsModule } from '../brands/brands.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CartModule } from '../cart/cart.module';
import { AddressesModule } from '../addresses/addresses.module';
import { OrdersModule } from '../orders/order.module';
import { TicketsModule } from '../tickets/tickets.module';
import { DiscountsModule } from '../discounts/discounts.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,               // Make ConfigModule available everywhere without re-importing
      validationSchema,             // Attach Joi validation
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'assets'), 
      serveRoot: '/assets', 
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: 'redis://localhost:6379',
      }),
    }),
    ProductsModule,
    DepartmentsModule,
    CategoriesModule,
    GroupsModule,
    BrandsModule,
    CloudinaryModule,
    VariantsModule,
    AuthModule,
    UsersModule,
    CartModule,
    AddressesModule,
    OrdersModule,
    TicketsModule,
    DiscountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
