import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
// import { Category } from './../schemas/category.schema'
// import { Image } from 'src/utils/schemas';

export class EditSettingsDto {
    @IsNotEmpty()
    aboutUs: string;

    @IsNotEmpty()
    ourStory: string;

    @IsNotEmpty()
    returnAndExchangePolicy: string;

    @IsNotEmpty()
    contactWhatsapp: string;

    @IsNotEmpty()
    contactPhone: string;


    @IsNotEmpty()
    contactEmail: string;
}

