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
    @Prop({ type: String, unique: true, required: false })
    orderNumber: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];


    @Prop({ default: 0 }) // calculated order total price
    totalPrice: number;

    @Prop({ default: 0 }) // calculated order total price
    finalPrice: number;

    @Prop({
        type: {
            code: { type: String },
            discountType: { type: String, enum: ['percentage', 'fixed'] },
            value: { type: Number }
        },
        _id: false // to prevent an _id field for the discount subdocument
    })
    discount?: {
        code: string;
        discountType: 'percentage' | 'fixed';
        value: number;
    };

    // payment method
    @Prop({ type: String, enum: ['credit_card', 'cash_on_delivery', 'apple_pay', 'tabby', 'tamara'], default: 'cash_on_delivery' })
    paymentMethod: PaymentMethod;


    @Prop({ default: 0 }) // cost of shipping
    shippingCost: number;

    @Prop({ default: 'unpaid' }) // total - discount + shipping
    paymentStatus?: 'paid' | 'unpaid' | 'refunded';

    @Prop()
    paymentReference?: string; // Transaction ID from payment gateway


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true })
    shippingAddress: mongoose.Schema.Types.ObjectId;

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


    @Prop({ type: Date }) // Date when the order was shipped
    shippedDate?: Date;

    @Prop({ type: String, default: null }) // Transaction ID from payment gateway
    transactionId?: string | null;

}

export const OrderSchema = SchemaFactory.createForClass(Order);






OrderSchema.pre<Order>('save', async function (next) {
    if (!this.orderNumber) {
        // You can use a timestamp + random digits or an incremental counter
        const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        this.orderNumber = `ORD-${timestamp}${random}`;
    }
    next();
});