import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema'; // adjust path accordingly
import { User } from 'src/modules/users/schemas/user.schema';

export type CartDocument = Cart & Document;

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
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user?: User;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0 }) // calculated total
  totalItems: number;

  @Prop({ default: 0 }) // calculated cart total price
  totalPrice: number;

  @Prop({ default: false })
  isOrdered: boolean; // to prevent modifying after checkout
}

export const CartSchema = SchemaFactory.createForClass(Cart);
