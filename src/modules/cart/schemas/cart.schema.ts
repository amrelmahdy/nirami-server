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

  @Prop({ default: 0 }) // calculated total
  totalItems: number;

  @Prop({ default: 0 }) // calculated cart total price
  totalPrice: number;

  @Prop({ default: false })
  isOrdered: boolean; // to prevent modifying after checkout

  @Prop({ default: 0 }) // cost of shipping
  shippingCost: number;

  @Prop({ default: 0 }) // total - discount + shipping
  finalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Dynamically calculate totalItems and totalPrice before saving
CartSchema.pre('save', function (next) {
  // 'this' refers to the Cart document
  this.totalItems = Array.isArray(this.items)
    ? this.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  // Calculate totalPrice using price or salesPrice depending on isOnSale
  this.totalPrice = Array.isArray(this.items)
    ? this.items.reduce((sum, item) => {
      const unitPrice: any = item.unitPrice;
      return sum + (item.quantity || 0) * unitPrice;
    }, 0)
    : 0;

  // Calculate shipping cost: free if totalPrice >= 500, else 25
  if (this.totalPrice >= 500) {
    this.shippingCost = 0;
  } else {
    this.shippingCost = 25;
  }

  let discountAmount = 0;

  if (this.discount) {
    if (this.discount.discountType === 'percentage') {
      discountAmount = Math.round((this.totalPrice * this.discount.value) / 100);
    } else if (this.discount.discountType === 'fixed') {
      discountAmount = this.discount.value;
    }

    // Prevent discount from exceeding totalPrice
    if (discountAmount > this.totalPrice) {
      discountAmount = this.totalPrice;
    }

    // Optionally, you can remove this.discount.amount if not needed elsewhere
  } else {
    discountAmount = 0;
  }

  const shipping = this.shippingCost || 0;
  this.finalPrice = this.totalPrice - discountAmount + shipping;

  next();
});
