import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';



export type TicketType = 'complain' | 'query' | 'return';

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
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({
        type: String,
        enum: [
            'complain',
            'query',
            'return'
        ], default: 'return'
    })
    type?: TicketType;

    @Prop({ required: true })
    message: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

