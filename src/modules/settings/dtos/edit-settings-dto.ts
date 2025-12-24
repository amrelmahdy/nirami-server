import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
// import { Category } from './../schemas/category.schema'
// import { Image } from 'src/utils/schemas';

export class EditSettingsDto {

    @IsNotEmpty()
    @IsLocalizedString(['en', 'ar'], { message: 'Value must have valid language keys and strings' })
    aboutUs: Record<string, string>;

    @IsNotEmpty()
    @IsLocalizedString(['en', 'ar'], { message: 'Value must have valid language keys and strings' })
    ourStory: Record<string, string>;

    @IsNotEmpty()
    @IsLocalizedString(['en', 'ar'], { message: 'Value must have valid language keys and strings' })
    returnAndExchangePolicy: Record<string, string>;

    @IsNotEmpty()
    contactWhatsapp: string;

    @IsNotEmpty()
    contactPhone: string;


    @IsNotEmpty()
    contactEmail: string;
}

