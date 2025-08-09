import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../cart/schemas/cart.schema';
import mongoose from 'mongoose';
import { Order } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private ordersModel: mongoose.Model<Order>,
        private cartService: CartService,
        private usersService: UsersService,
    ) { }


    async getOrderHistory(userId: string): Promise<Order[]> {
        let orders: Order[] = [];
        if (!userId) {
            throw new BadRequestException('User ID is required to get order history');
        }

        // get user
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }


        if (user.role === UserRole.ADMIN) {
            orders = await this.ordersModel.find().sort({ createdAt: -1 }).populate("user");

        } else {
            orders = await this.ordersModel.find({ user: userId }).sort({ createdAt: -1 }).populate("user");;

        }

        if (!orders) {
            throw new NotFoundException('No orders found for the given user ID');
        }

        return orders;
    }

    async checkout(userId: string, order: any) {

        const { paymentMethod, status, paymentStatus, shippingAddress, paymentReference } = order;


        if (!userId) {
            throw new NotFoundException('User ID is required to checkout');
        }

        const cart = await this.cartService.getCart(userId);

        if (!cart) {
            throw new NotFoundException('Cart not found for the given user ID');
        }

        const orderData = {
            user: userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            finalPrice: cart.finalPrice,
            shippingCost: cart.shippingCost,
            discount: cart.discount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            shippingAddress: shippingAddress,
            paymentReference: paymentReference,
            status: status
        };


        // Create a new order with the userId and cart items    
        const newOrder = new this.ordersModel(orderData);
        const orderCreated = await newOrder.save();

        if (!orderCreated) {
            throw new BadRequestException('Failed to create order');
        } else {
            this.cartService.orderCart(userId);
        }

        return orderCreated;

    }

    async getOrderDetails(userId: string, orderId: string): Promise<Order> {
        if (!userId) {
            throw new NotFoundException('User ID is required to get order details');
        }
        if (!orderId) {
            throw new NotFoundException('Order ID is required to get order details');
        }

        // Cast the result to Order to satisfy TypeScript, but note this is only safe if the Cart and Order schemas are compatible.
        const order = await this.ordersModel.findOne({ user: userId, _id: orderId }).populate({
            path: 'items.product',
            populate: { path: 'brand' }
        });;

        if (!order) {
            throw new NotFoundException('Order not found for the given user ID and order ID');
        }

        return order;
    }


}
