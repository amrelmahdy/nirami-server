import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
import { Brand } from 'src/modules/brands/schemas/brand.schema';
import { Group } from 'src/modules/groups/schemas/group.schema';
import { Variant } from 'src/modules/variants/schemas/variant.schema';
import { Image } from 'src/utils/schemas';
import { Product } from '../schemas/product.schema';
import { LocalizedName } from 'src/utils/validation';



export class ProductColor {
    @ValidateNested()
    @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
    @Type(() => LocalizedName)
    name: LocalizedName;

    @IsString()
    value: string; // e.g. "#00FF00"
}



export class CreateProductDto {
    @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
    @Type(() => LocalizedName)
    name: LocalizedName;

    @IsLocalizedString(['en', 'ar'], { message: 'Description must have valid language keys and strings' })
    @IsNotEmpty()
    description: LocalizedName;

    @IsLocalizedString(['en', 'ar'], { message: 'Components must have valid language keys and strings' })
    @IsOptional()
    components: LocalizedName;

    @IsOptional()
    @IsMongoId({ message: 'parentProduct must be a valid Mongo ID' })
    parentProduct?: Product;

    @IsOptional()
    @ValidateNested()
    @Type(() => ProductColor)
    color?: ProductColor;

    @IsNotEmpty()
    brand: Brand;


    @IsNotEmpty()
    group: Group;

    @IsNumber()
    price: number;

    @IsNumber()
    salesPrice: number;

    @IsOptional()
    productCardImage: string

    @IsOptional()
    @IsArray()
    images: Image[];


    @IsNotEmpty()
    maxQuantity: number;

    @IsOptional()
    averageRating: number;

    @IsOptional()
    reviewCount: number;

    @IsNumber()
    stock: number;

    @IsNotEmpty()
    sku: string;

    @IsBoolean()
    @IsOptional()
    isOutOfStock: boolean;

    @IsBoolean()
    @IsOptional()
    isOnSale: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured: boolean;

    @IsBoolean()
    @IsOptional()
    isPublished: boolean;
}



