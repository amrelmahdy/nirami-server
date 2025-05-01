import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reviewSchema } from './schemas/review.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Review', schema: reviewSchema }])],
  controllers: [ReviewsController]
})
export class ReviewsModule { }
