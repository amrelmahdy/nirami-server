import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product-dto';
import { CreateVariantDto } from '../variants/dtos/create-variant-dto';
import { UpdateProductDto } from './dtos/update-product-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddReviewDto } from './dtos/add-review-dto';
import { Review } from '../reviews/schemas/review.schema';


@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Request() req,
        @Query('query') query?: string,
        @Query('groupId') groupId?: string,
        @Query('categoryId') categoryId?: string,
        @Query('brandId') brandId?: string,
        @Query('sortBy') sortBy?: 'isFeatured' | 'isOnSale' | 'priceUp' | 'priceDown' | 'new',
        @Query('price') price?: number,
        @Query('priceFrom') priceFrom?: number,
        @Query('priceTo') priceTo?: number,
        @Query('onlyParents') onlyParents?: boolean,
    ): Promise<{ total: number; products: Product[]; limit: number; page: number }> {
        const userId = req.user?.userId;
        return this.productService.findAll({ query, groupId, categoryId, brandId, sortBy, price, priceFrom, priceTo, onlyParents }, userId);
    }



    @UseGuards(JwtAuthGuard)
    @Get("/most-saled")
    async getMostSaledProducts(
        @Request() req,
        @Param("id") id: string): Promise<Product[]> {
        const userId = req.user?.userId;
        return this.productService.getMostSaledProducts(userId);
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
    async createProduct(@Body() product: CreateProductDto): Promise<Product> {
        return this.productService.create(product);
    }


    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async findProductById(@Param("id") id: string): Promise<Product> {
        return this.productService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/variants")
    async getProductVariants(@Param("id") id: string): Promise<Product[]> {
        return this.productService.getProductVariants(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ): Promise<Product> {
        return this.productService.update(id, product);
    }


    // reviews
    @UseGuards(JwtAuthGuard)
    @Post(':id/reviews')
    async createReview(
        @Request() req,
        @Param('id') productId: string,
        @Body() review: AddReviewDto
    ): Promise<Review> {
        const userId = req.user?.userId;
        return this.productService.createReview(productId, userId, review);
    }

     // reviews
    @UseGuards(JwtAuthGuard)
    @Post(':id/reviews/helpful')
    async makeReviewHelpufull(
        @Request() req,
        @Param('id') reviewId: string,
    ): Promise<Review> {
        return this.productService.makeReviewHelpful(reviewId);
    }

}
