import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as path from 'path';
// import { Address } from "src/addresses/schemas/address.schema";
// import { Product } from "src/products/schemas/product.schema";
import * as os from 'os';
import { getDefaultImagePath } from "src/config/utils";
import { Product } from "src/modules/products/schemas/product.schema";


export enum UserRole {
    USER = 0,
    ADMIN = 1,
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown",
}


@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.password;
            return ret;
        },
    },
})


export class User {

    @Prop({ required: true })
    first_name: string

    @Prop({ required: true })
    last_name: string

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true, unique: true })
    phone: string

    @Prop({ default: getDefaultImagePath })
    image: string;

    @Prop({ required: true })
    password: string; // only used by admins

    @Prop({ default: false })
    isProfileCompleted: boolean;

    @Prop({ enum: Gender, default: Gender.UNKNOWN })
    gender: Gender;

    @Prop({ enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], default: [] })
    favList: Product[]

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], default: [] })
    // addresses: Address[]




    // orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

    // name: {
    //     type: String,
    //     required: true,
    // },
    // email: {
    //     type: String,
    //     index: true,
    //     unique: true,
    //     lowercase: true,
    //     required: true,
    // },
    // mobile: String,
    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },
    // password: {
    //     type: String,
    //     //select: false,
    // },

    // role: {
    //     type: Number,
    //     default: 0 //  User by default
    // },
    // orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    // addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    // paymentMethods: [{ type: Schema.Types.ObjectId, ref: 'PaymentMethod' }]

}


export const userSchema = SchemaFactory.createForClass(User)