import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';



export type TicketType = 'complaint' | 'inquiry' | 'return_or_exchange';


export type TicketStatus =
    | 'created'
    | 'processing'
    | 'completed'
    | 'closed'
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


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: String, unique: true, required: false })
    ticketNumber?: string;


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
            'complaint',
            'inquiry',
            'return_or_exchange'
        ], default: 'return_or_exchange'
    })
    type?: TicketType;

    @Prop({ required: true })
    message: string;

    // status of the order
    @Prop({
        type: String, enum: [
            'created',
            'processing',
            'completed',
            'closed',
            'returned',
        ], default: 'created'
    })
    status: TicketStatus;

    @Prop({ required: false })
    comment: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);



TicketSchema.pre<Ticket>('save', async function (next) {
    if (!this.ticketNumber) {
        // You can use a timestamp + random digits or an incremental counter
        const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        this.ticketNumber = `${timestamp}${random}`;
    }
    next();
});