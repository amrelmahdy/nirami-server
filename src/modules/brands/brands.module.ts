import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { brandSchema } from './schemas/brand.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Brand', schema: brandSchema }])],
  providers: [BrandsService],
  controllers: [BrandsController]
})
export class BrandsModule { }
