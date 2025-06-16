import { Module } from '@nestjs/common';
import { VariantsController } from './variants.controller';
import {  VariantsService } from './variants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { variantSchema } from './schemas/variant.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Variant', schema: variantSchema }])],
  controllers: [VariantsController],
  providers: [VariantsService],
   exports: [VariantsService]
})
export class VariantsModule {}
