import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    @IsEnum(['complaint', 'inquiry', 'return_or_exchange'])
    type?: 'complaint' | 'inquiry' | 'return_or_exchange';

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
