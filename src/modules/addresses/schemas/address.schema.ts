import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";



export type AddressDocument = Address & Document;


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
export class Address {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;


    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    deliveryAddress: string;

    @Prop({ type: { lat: Number, lng: Number, displayName: String, _id: false }, required: false })
    location: {
        displayName: string;
        lat: number;
        lng: number;
    };

    @Prop({ default: false })
    isDefault?: boolean;
}

export const addressSchema = SchemaFactory.createForClass(Address);
// // Add a virtual field to get the full address
// AddressSchema.virtual('fullAddress').get(function (this: Address) {                     
//     return `${this.addressLine1}, ${this.addressLine2 ? this.addressLine2 + ', ' : ''}${this.city}, ${this.state}, ${this.country} - ${this.postalCode}`;
// });