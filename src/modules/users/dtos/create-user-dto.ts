import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Gender, UserRole } from "../schemas/user.schema";
import { Product } from "src/modules/products/schemas/product.schema";
// import { Address } from "src/addresses/schemas/address.schema";
// import { Product } from "src/products/schemas/product.schema";

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
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
    favList: Product[]

    // @IsOptional()
    // wish_list: Product[];

    // @IsOptional()
    // addresses: Address[];
}