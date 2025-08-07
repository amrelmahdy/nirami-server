import { IsArray, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDate, IsInt, IsString } from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';

export class CreateDiscountDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsEnum(['percentage', 'fixed'], { message: 'discountType must be either percentage or fixed' })
    discountType?: 'percentage' | 'fixed';

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsNotEmpty()
    @IsDate()
    expiresAt?: Date;

    @IsOptional()
    @IsInt()
    usageCount?: number;

    @IsOptional()
    @IsInt()
    maxUsage?: number;
}