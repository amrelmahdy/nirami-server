import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Brand } from './schemas/brand.schema';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dtos/create-brand-dto';
import { EditBrandDto } from './dtos/update-brand-dto';

@Controller('brands')
export class BrandsController {

    constructor(private brandService: BrandsService) { }

    @Get()
    getAllBrands(): Promise<Brand[]> {
        return this.brandService.findAll();
    }


    @Get(":id")
    getBrandById(@Param("id") id: string): Promise<Brand> {
        return this.brandService.findById(id);
    }



    @Put(":id")
    updateBrand(@Param("id") id: string, @Body() brand: EditBrandDto): Promise<Brand> {
        return this.brandService.update(id, brand);
    }


    @Post()
    cretae(@Body() brand: CreateBrandDto) {
        return this.brandService.create(brand);
    }



    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.brandService.delete(id);
    }
}
