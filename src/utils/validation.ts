import { isEmpty, IsNotEmpty, IsString } from "class-validator";

export class LocalizedName {
    @IsNotEmpty()
    @IsString()
    en: string;

    @IsNotEmpty()
    @IsString()
    ar: string;
}