import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';


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

@Schema({ timestamps: false })
export class Setting {
    @Prop()
    aboutUs: string;

    @Prop()
    ourStory: string;

    @Prop()
    returnAndExchangePolicy: string;

    @Prop()
    contactWhatsapp: string;

     @Prop()
    contactPhone: string;

     @Prop()
    contactEmail: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
