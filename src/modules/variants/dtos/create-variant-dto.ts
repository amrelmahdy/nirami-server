import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
import { Image } from 'src/utils/schemas';
// import { Category } from './../schemas/category.schema'
// import { Image } from 'src/utils/schemas';

export class CreateVariantDto {
    @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
    name: Record<string, string>;

    @IsOptional()
    image: string;

    @IsNumber()
    price: number;

    @IsNumber()
    salesPrice: number;

    @IsOptional()
    @IsArray()
    images: Image[];

    @IsOptional()
    @IsNotEmpty()
    maxQuantity: number;

    @IsNumber()
    stock: number;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsBoolean()
    @IsOptional()
    isOutOfStock: boolean;

    @IsBoolean()
    @IsOptional()
    isOnSale: boolean;

    @IsString()
    @IsNotEmpty()
    color: string
}