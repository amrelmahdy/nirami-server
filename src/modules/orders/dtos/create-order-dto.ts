// create dto for creating an order
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {

    @IsNotEmpty()
    @IsEnum(['credit_card', 'cash_on_delivery', 'apple_pay', 'tabby', 'tamara'])
    paymentMethod: 'credit_card' | 'cash_on_delivery' | 'apple_pay' | 'tabby' | 'tamara';

    @IsNotEmpty()
    shippingAddress: string

    @IsString()
    paymentStatus?: 'paid' | 'unpaid' | 'refunded';

    @IsOptional()
    paymentReference?: string;


    @IsNotEmpty()
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
