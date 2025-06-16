import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dtos/create-category-dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

    @Get()
    getAllCategories(
      @Query('query') query?: string,
      @Query('departmentId') departmentId?: string
    ): Promise<Category[]> {
      return this.categoriesService.findAll({ query, departmentId });
    }
    @Post()
    cretae(@Body() brand: CreateCategoryDto) {
        return this.categoriesService.create(brand);
    }


    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.categoriesService.delete(id);
    }
}
