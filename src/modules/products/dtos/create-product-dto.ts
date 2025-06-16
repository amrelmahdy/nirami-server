import {
    IsArray,
    IsBoolean,
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


export class CreateProductDto {
    @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
    name: Record<string, string>;
  
    @IsLocalizedString(['en', 'ar'], { message: 'Description must have valid language keys and strings' })
    @IsNotEmpty()
    description: Record<string, string>;

    @IsLocalizedString(['en', 'ar'], { message: 'Components must have valid language keys and strings' })
    @IsOptional()
    components: Record<string, string>;

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

     @IsOptional()
    @IsArray()
    variants: Variant[];

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



