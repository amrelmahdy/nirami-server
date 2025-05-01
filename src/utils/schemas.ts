import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Image {
  @Prop({ required: true }) url: string;
  @Prop() public_id?: string;
  @Prop() width?: number;
  @Prop() height?: number;
}