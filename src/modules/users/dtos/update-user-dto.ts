import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Gender, UserRole } from "../schemas/user.schema";
import { Product } from "src/modules/products/schemas/product.schema";
// import { Address } from "src/addresses/schemas/address.schema";
// import { Product } from "src/products/schemas/product.schema";

export class UpdateUserDto {
    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsOptional()
    isProfileCompleted: boolean;

    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole;

    @IsEnum(Gender)
    @IsOptional()
    gender: Gender;

    @IsOptional()
    image: string;


    @IsOptional()
    dateOfBirth: Date;

    @IsOptional()
    favList: Product[]

    // @IsOptional()
    // wish_list: Product[];

    // @IsOptional()
    // addresses: Address[];
}