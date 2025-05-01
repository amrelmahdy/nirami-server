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
import { Image } from 'src/utils/schemas';

class ImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsOptional()
    @IsString()
    public_id?: string;

    @IsOptional()
    @IsNumber()
    width?: number;

    @IsOptional()
    @IsNumber()
    height?: number;
}

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


    @IsNumber()
    price: number;

    @IsNumber()
    salesPrice: number;

    @IsOptional()
    productCardImage: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    images: Image[];

    @IsNotEmpty()
    maxQuantity: number;

    @IsOptional()
    averageRating: number;

    @IsOptional()
    reviewCount: number;

    @IsNumber()
    stock: number;

    @IsOptional()
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



