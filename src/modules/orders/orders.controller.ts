import { Body, Controller, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/schemas/cart.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Order } from './schemas/order.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order-dto';

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrdersService) { }


    @UseGuards(JwtAuthGuard)
    @Get()
    async getOrderHistory(@Request() req): Promise<Order[]> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to get order history');
        }
        return this.orderService.getOrderHistory(userId);
    }

    // @UseGuards(JwtAuthGuard)
    // async checkout(@Request() req): Promise<Order> {
    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async checkout(
        @Request() req,
        @Body() order: CreateOrderDto
    ): Promise<any> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to checkout');
        }
        return this.orderService.checkout(userId, order);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':orderId')
    async getOrderDetails(@Request() req, @Param('orderId') orderId:
        string): Promise<Order> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to get order details');
        }
        if (!orderId) {
            throw new NotFoundException('Order ID is required to get order details');
        }
        return this.orderService.getOrderDetails(userId, orderId);
    }

}
