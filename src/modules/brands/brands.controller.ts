import { Body, Controller, Get, Post } from '@nestjs/common';
import { Brand } from './schemas/brand.schema';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dtos/create-brand-dto';

@Controller('brands')
export class BrandsController {

    constructor(private brandService: BrandsService){}

    @Get()
    getAllBrands(): Promise<Brand[]>{
        return this.brandService.findAll();
    }


    @Post()
    cretae(@Body() brand: CreateBrandDto){
        return this.brandService.create(brand);
    }
}
