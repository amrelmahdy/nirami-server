import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Order } from 'src/modules/orders/schemas/order.schema';


export class CreateTicketDto {
    @IsNotEmpty()
    orderNumber: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsEnum(['complain', 'query', 'return'])
    type?: 'complain' | 'query' | 'return';

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsEnum([
        'pending',
        'processing',
        'completed',
        'cancelled',
        'returned'
    ])


    @IsNotEmpty()
    @IsEnum([
        'pending',
        'processing',
        'completed',
        'cancelled',
        'returned'
    ])
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'returned';

    @IsOptional()
    @IsString()
    comment: string;
}
