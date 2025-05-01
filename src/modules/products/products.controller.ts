import { Body, Controller, Get, Post } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductsService } from './products.service';
import { CreateBrandDto } from '../brands/dtos/create-brand-dto';
import { CreateProductDto } from './dtos/create-product-dto';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService){}

    @Get()
    getAllBrands(): Promise<Product[]>{
        return this.productService.findAll();
    }


    @Post()
    createProduct(@Body() product: CreateProductDto): Promise<Product>{
        return this.productService.create(product);
    }
}
