import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { IsLocalizedString } from 'src/config/validation';
import { Department } from 'src/modules/departments/schemas/department.schema';
// import { Category } from './../schemas/category.schema'
// import { Image } from 'src/utils/schemas';

export class EditCategoryDto {
    @IsOptional()
    @IsLocalizedString(['en', 'ar'], { message: 'Name must have valid language keys and strings' })
    name: Record<string, string>;

    @IsOptional()
    image: string;

    @IsNotEmpty()
    department: Department;
}