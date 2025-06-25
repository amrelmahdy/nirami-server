import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../cart/schemas/cart.schema';
import mongoose from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Cart.name) private ordersModel: mongoose.Model<Cart>,
    ) { }

    async checkout(userId: string): Promise<Order> {
        if (!userId) {
            throw new Error('User ID is required to checkout');
        }

        const cart = await this.ordersModel.findOne({ user: userId, isOrdered: false });

        if (!cart) {
            throw new Error('Cart not found for the given user ID');
        }

        // Here you would typically process the payment and create an order
        // For simplicity, we will just mark the cart as ordered
        cart.isOrdered = true;
        await cart.save();

        // Cast the result to Order to satisfy TypeScript, but note this is only safe if the Cart and Order schemas are compatible.
        return cart as unknown as Order;
    }

    async getOrderDetails(userId: string, orderId: string): Promise<Order> {
        if (!userId) {
            throw new Error('User ID is required to get order details');
        }
        if (!orderId) {
            throw new Error('Order ID is required to get order details');
        }

        // Cast the result to Order to satisfy TypeScript, but note this is only safe if the Cart and Order schemas are compatible.
        const order = await this.ordersModel.findOne({ user: userId, _id: orderId }) as unknown as Order;

        if (!order) {
            throw new Error('Order not found for the given user ID and order ID');
        }

        return order;
    }   

    async getOrderHistory(userId: string): Promise<Order[]> {    
        if (!userId) {
            throw new Error('User ID is required to get order history');
        }

        // Cast the result to Order[] to satisfy TypeScript, but note this is only safe if the Cart and Order schemas are compatible.
        const orders = await this.ordersModel.find({ user: userId, isOrdered: true }) as unknown as Order[];

        if (!orders || orders.length === 0) {
            throw new Error('No orders found for the given user ID');
        }

        return orders;
    }
}
