import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Image } from 'src/utils/schemas';


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

export class Variant {

    @Prop({ type: Object })
    name: Record<string, string>;

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

    @Prop({ default: [] })
    images: Image[];

    @Prop({ default: false })
    isOutOfStock: boolean;

    @Prop()
    color: string; // optional field
}

export const variantSchema = SchemaFactory.createForClass(Variant);

