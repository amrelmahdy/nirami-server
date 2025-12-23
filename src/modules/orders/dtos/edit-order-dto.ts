// create dto for creating an order
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsLocalizedString } from 'src/config/validation';
import { User } from 'src/modules/users/schemas/user.schema';
import { CartItem } from 'src/modules/cart/schemas/cart-item.schema';


export class EditOrderDto {

    @IsOptional()
    @IsEnum(['credit_card', 'cash_on_delivery', 'apple_pay', 'tabby', 'tamara'])
    paymentMethod: 'credit_card' | 'cash_on_delivery' | 'apple_pay' | 'tabby' | 'tamara';

    @IsOptional()
    shippingAddress: string

    @IsOptional()
    @IsString()
    paymentStatus?: 'paid' | 'unpaid' | 'refunded';


    @IsOptional()
    paymentReference?: string;


    @IsOptional()
    @IsEnum([
        'pending',
        'awaiting_payment',
        'payment_failed',
        'processing',
        'on_hold',
        'shipped',
        'out_for_delivery',
        'delivered',
        'completed',
        'cancelled',
        'failed',
        'returned',
        'refunded',
        'partially_shipped',
        'partially_refunded',
        'ready_for_pickup',
        'rescheduled',
        'expired'
    ])
    status: string;
}
