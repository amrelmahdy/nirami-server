import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dtos/create-category-dto';
import { EditCategoryDto } from './dtos/edit-category-dto';

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


  @Get(":id")
  getBrandById(@Param("id") id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }



  @Put(":id")
  updateBrand(@Param("id") id: string, @Body() category: EditCategoryDto): Promise<Category> {
    return this.categoriesService.update(id, category);
  }


  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.categoriesService.delete(id);
  }
}
