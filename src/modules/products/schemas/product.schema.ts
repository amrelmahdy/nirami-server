import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { getDefaultImagePath } from 'src/config/utils';
import { Brand } from 'src/modules/brands/schemas/brand.schema';
import { Variant } from 'src/modules/variants/schemas/variant.schema';
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
    name: { en: string; ar: string };

    @Prop({ type: Object })
    description: { en: string; ar: string };

    @Prop({ type: Object })
    components: { en: string; ar: string };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null })
    parentProduct?: Product; // null = this is the main product

    @Prop({
        type: Object,
        default: null,
    })
    color?: {
        name: { en: string; ar: string };
        value: string;
    };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
    brand: Brand;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
    group: Brand;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    salesPrice: number;

    @Prop({ default: 0 })
    maxQuantity: number

    @Prop({ default: 0 })
    stock: number;

    @Prop({ required: true, unique: true })
    sku: string;

    @Prop({ default: 5 })
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

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});
