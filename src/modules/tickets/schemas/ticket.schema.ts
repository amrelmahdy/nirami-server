import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';

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
export class Ticket {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
    order: Order;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: number;

    @Prop({ required: true })
    phone: string;

    @Prop({ default: 'unpaid' }) // total - discount + shipping
    type?: 'complain' | 'query' | 'return';

    @Prop({ required: true })
    message: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

