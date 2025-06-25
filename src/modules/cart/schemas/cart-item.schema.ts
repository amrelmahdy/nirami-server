import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

export type CartItemDocument = CartItem & Document;

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
