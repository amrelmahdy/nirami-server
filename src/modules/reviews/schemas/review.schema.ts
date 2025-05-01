import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true })
    reviewerName: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment: string;
}

export const reviewSchema = SchemaFactory.createForClass(Review);
