import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';


@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            return ret;
        },
    },
})

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    review: string;

    @Prop({ required: true, default: true })
    showName: boolean;

    @Prop({ default: 0 })
    helpfulVotes: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
