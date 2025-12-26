import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTicketDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsEnum(['complaint', 'inquiry', 'return_or_exchange'])
    type?: 'complaint' | 'inquiry' | 'return_or_exchange';

    @IsOptional()
    @IsString()
    message: string;



    @IsOptional()
    @IsEnum([
        'created',
        'processing',
        'completed',
        'closed'
    ])
    status: 'created' | 'processing' | 'completed' | 'closed';

    @IsOptional()
    @IsString()
    comment: string;
}
