
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsLocalizedString } from 'src/config/validation';
import { User } from 'src/modules/users/schemas/user.schema';


export class CreateAddressDto {


    @IsOptional()
    user: User;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsString()
    @IsNotEmpty()
    deliveryAddress: string;

    @IsNotEmpty()
    location: { lat: number; lng: number, displayName: string };

    @IsOptional()
    isDefault?: boolean;

}



















