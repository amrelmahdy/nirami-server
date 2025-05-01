import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { getDefaultImagePath } from "src/config/utils";
import { Department } from "src/modules/departments/schemas/department.schema";


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

export class Category {
    @Prop({ type: Object })
    name: Record<string, string>;

    @Prop({ default: getDefaultImagePath })
    image: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true })
    department: Department;
}

export const categorySchema = SchemaFactory.createForClass(Category);