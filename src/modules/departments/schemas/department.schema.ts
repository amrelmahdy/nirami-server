import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getDefaultImagePath } from "src/config/utils";



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

export class Department {
    @Prop({ type: Object })
    name: Record<string, string>;

    @Prop({ default: getDefaultImagePath })
    image: string;
}

export const departmentSchema = SchemaFactory.createForClass(Department);


departmentSchema.virtual('categories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'department',
});