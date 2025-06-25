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
    async removeFromCart(@Request() req, @Param('productId') productId: string): Promise<Cart> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to remove from cart');
        }
        return this.cartService.removeFromCart(userId, productId);
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
