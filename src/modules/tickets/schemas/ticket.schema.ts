import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';



export type TicketType = 'complain' | 'query' | 'return';


export type TicketStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'cancelled'
    | 'returned';


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

    @Prop({ type: String, required: false })
    orderNumber: string;

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

    // status of the order
    @Prop({
        type: String, enum: [
            'pending',
            'processing',
            'completed',
            'cancelled',
            'returned',
        ], default: 'pending'
    })
    status: TicketStatus;

    @Prop({ required: false })
    comment: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

