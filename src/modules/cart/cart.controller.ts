import { Controller, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Product } from '../products/schemas/product.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { Cart } from './schemas/cart.schema';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getMostSaledProducts(@Request() req): Promise<Cart> {
        const userId = req.user?.userId;
          if (!userId) {
            throw new NotFoundException('User ID is required');
        }   
        return this.cartService.getCart(userId);
    }


    // add to cart
    @UseGuards(JwtAuthGuard)
    @Post('add/:productId')
    async addToCart(@Request() req, @Param('productId') productId: string): Promise<Cart> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to add to cart');
        }                                           
        return this.cartService.addToCart(userId, productId);                               
    }

    // remove from cart
    @UseGuards(JwtAuthGuard)
    @Post('remove/:productId')
    async removeFromCart(
        @Request() req,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to remove from cart');
        }
        // Accept removeAll as a query param (?removeAll=true) or as a boolean in the body if you prefer
        const removeCompletely = req.query?.removeCompletely === 'true' || false;
        return this.cartService.removeFromCart(userId, productId, removeCompletely);
    }          
    
    
    @UseGuards(JwtAuthGuard)
    @Post('clear')
    async clearCart(@Request() req): Promise<Cart> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to clear the cart');
        }
        return this.cartService.clearCart(userId);
    }




    // Apply discount to cart
    // Using cartId is more RESTful and allows targeting a specific cart (especially if a user can have multiple carts).
    // Example endpoint using cartId:
    @UseGuards(JwtAuthGuard)
    @Post(':cartId/discount/:discountCode')
    async applyDiscount(
        @Param('cartId') cartId: string,
        @Param('discountCode') discountCode: string
    ): Promise<Cart> {
        // No need to extract userId if you trust cartId is unique and access is checked elsewhere
        return this.cartService.applyDiscountByCartId(cartId, discountCode);
    }


    @UseGuards(JwtAuthGuard)
    @Post('order')
    async orderCart(@Request() req): Promise<Cart> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to order the cart');
        }
        return this.cartService.orderCart(userId);
    }
}
