// order schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { User } from 'src/modules/users/schemas/user.schema';
import { CartItem, CartItemSchema } from 'src/modules/cart/schemas/cart-item.schema';


export type OrderStatus =
    | 'pending'
    | 'awaiting_payment'
    | 'payment_failed'
    | 'processing'
    | 'on_hold'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'failed'
    | 'returned'
    | 'refunded'
    | 'partially_shipped'
    | 'partially_refunded'
    | 'ready_for_pickup'
    | 'rescheduled'
    | 'expired';


export type PaymentMethod =
    | 'credit_card'
    | 'cash_on_delivery'
    | 'apple_pay'
    | 'tabby'
    | 'tamara'



export type OrderDocument = Order & Document;
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


export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];


    @Prop({ default: 0 }) // calculated order total price
    totalPrice: number;

    // payment method
    @Prop({ type: String, enum: ['credit_card', 'cash_on_delivery', 'apple_pay'], default: 'cash_on_delivery' })
    paymentMethod: PaymentMethod;

    // status of the order
    @Prop({
        type: String, enum: [
            'pending',
            'awaiting_payment',
            'payment_failed',
            'processing',
            'on_hold',
            'shipped',
            'out_for_delivery',
            'delivered',
            'completed',
            'cancelled',
            'failed',
            'returned',
            'refunded',
            'partially_shipped',
            'partially_refunded',
            'ready_for_pickup',
            'rescheduled',
            'expired'
        ], default: 'pending'
    })
    status: OrderStatus;

}

export const OrderSchema = SchemaFactory.createForClass(Order);






