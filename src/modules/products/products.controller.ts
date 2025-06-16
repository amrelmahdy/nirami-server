import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product-dto';
import { CreateVariantDto } from '../variants/dtos/create-variant-dto';
import { UpdateProductDto } from './dtos/update-product-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllProducts(
        @Query('query') query?: string,
        @Query('groupId') groupId?: string,
        @Query('categoryId') categoryId?: string,
        @Query('brandId') brandId?: string,
        @Query('sortBy') sortBy?: 'isFeatured' | 'isOnSale' | 'priceUp' | 'priceDown' | 'new',
        @Query('price') price?: number,
        @Query('priceFrom') priceFrom?: number,
        @Query('priceTo') priceTo?: number,
    ): Promise<{ total: number; products: Product[]; limit: number; page: number }> {
        return this.productService.findAll({ query, groupId, categoryId, brandId, sortBy, price, priceFrom, priceTo });
    }



    @UseGuards(JwtAuthGuard)
    @Get("/most-saled")
    getMostSaledProducts(@Param("id") id: string): Promise<Product[]> {
        return this.productService.getMostSaledProducts();
    }


    // @UseGuards(JwtAuthGuard)
    // @Get("favorites")
    // getFavProducts(@Request() req){
    //     console.log("Fetching favorite products for user:", req.user);
    //     const userId = req.user._id; // Assuming the user ID is stored in the request object
    //     // return this.productService.findFavouriteProductsByUserId();
    // }

    // getAllGroups(
    //     @Query('query') query?: string,
    //     @Query('categoryId') categoryId?: string
    // ): Promise<Group[]> {
    //     return this.groupsService.findAll({ query, categoryId });
    // }

    @UseGuards(JwtAuthGuard)
    @Post()
    createProduct(@Body() product: CreateProductDto): Promise<Product> {
        return this.productService.create(product);
    }


    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findProductById(@Param("id") id: string): Promise<Product> {
        return this.productService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ): Promise<Product> {
        return this.productService.update(id, product);
    }


    @UseGuards(JwtAuthGuard)
    @Post(':id/variant')
    async addVariant(
        @Param('id') productId: string,
        @Body() variantDto: CreateVariantDto
    ) {
        return this.productService.addVariantToProduct(productId, variantDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/variant/:variantId')
    async deleteVariant(
        @Param('id') productId: string,
        @Param('variantId') variantId: string,
    ) {
        return this.productService.deleteVariantFromProduct(productId, variantId);
    }

    //add product to facvorites
    @UseGuards(JwtAuthGuard)
    @Post(':id/favourite')
    async toggleFavourite(
        @Param('id') productId: string,
        @Request() req: any
    ) {
        //console.log("Adding product to favorites for user:", req.user.userId);
        const userId = req.user.userId; // Assuming the user ID is stored in the request object
        return this.productService.toggleFavourite(userId, productId);
    }
}
