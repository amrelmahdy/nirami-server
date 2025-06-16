import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
import { Brand } from 'src/modules/brands/schemas/brand.schema';
import { Group } from 'src/modules/groups/schemas/group.schema';
import { Variant } from 'src/modules/variants/schemas/variant.schema';
import { Image } from 'src/utils/schemas';

export class UpdateProductDto {
  @IsOptional()
  @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
  name?: Record<string, string>;

  @IsOptional()
  @IsLocalizedString(['en', 'ar'], { message: 'Description must have valid language keys and strings' })
  description?: Record<string, string>;

  @IsOptional()
  @IsLocalizedString(['en', 'ar'], { message: 'Components must have valid language keys and strings' })
  components?: Record<string, string>;

  @IsOptional()
  brand?: Brand;

  @IsOptional()
  group?: Group;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  salesPrice?: number;

  @IsOptional()
  productCardImage?: string;

  @IsOptional()
  @IsArray()
  images?: Image[];

  @IsOptional()
  @IsArray()
  variants?: Variant[];

  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  reviewCount?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isOutOfStock?: boolean;

  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
