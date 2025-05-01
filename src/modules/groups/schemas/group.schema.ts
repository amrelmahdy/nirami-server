import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { getDefaultImagePath } from "src/config/utils";
import { Category } from "src/modules/categories/schemas/category.schema";


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

export class Group {
    @Prop({ type: Object })
    name: Record<string, string>;

    @Prop({ default: getDefaultImagePath })
    image: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    category: Category;
}

export const groupSchema = SchemaFactory.createForClass(Group);