import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { getDefaultImagePath } from 'src/config/utils';
import { Brand } from 'src/modules/brands/schemas/brand.schema';
import { Image } from 'src/utils/schemas';

export type ProductDocument = Product & Document;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
})

export class Product {

    @Prop({ type: Object })
    name: Record<string, string>;

    @Prop({ type: Object })
    description: Record<string, string>;

    @Prop({ type: Object })
    components: Record<string, string>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
    brand: Brand;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    salesPrice: number;

    @Prop({ default: 0 })
    maxQuantity: number

    @Prop({ default: 0 })
    stock: number;

    @Prop()
    sku: string;

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    reviewCount: number;

    @Prop({ default: getDefaultImagePath })
    productCardImage: string

    @Prop({ default: [] })
    images: Image[];

    @Prop({ default: false })
    isOutOfStock: boolean;


    @Prop({ default: false })
    isOnSale: boolean;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ default: false })
    isPublished: boolean;
}

export const productSchema = SchemaFactory.createForClass(Product);

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});
