import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})

export class Discount {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ enum: ['percentage', 'fixed'], required: true })
  discountType: 'percentage' | 'fixed';

  @Prop({ required: true })
  value: number;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: 0 })
  usageCount?: number;

 @Prop({ default: 1 })
  maxUsage?: number;
}

export const discountSchema = SchemaFactory.createForClass(Discount);