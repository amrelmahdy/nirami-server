import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import mongoose from 'mongoose';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {

    constructor(
        @InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>
    ) { }


    async getCart(userId: string): Promise<Cart> {
        if (!userId) {
            throw new Error('User ID is required to retrieve the cart');
        }

        const cart = await this.cartModel.findOne({ user: userId, isOrdered: false }).populate('items.product');

        if (!cart) {
            throw new NotFoundException('Cart not found for the given user ID');
        }

        return cart;
    }

    async addToCart(userId: string, productId: string): Promise<Cart> {
        if (!userId) {
            throw new NotFoundException('User ID is required to add to cart');
        }

        if (!productId) {
            throw new NotFoundException('Product ID is required to add to cart');
        }

        let cart = await this.cartModel.findOne({ user: userId, isOrdered: false });

        if (!cart) {
            cart = new this.cartModel({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex > -1) {
            // If the item already exists, increment the quantity
            cart.items[existingItemIndex].quantity += 1;
        } else {
            // If the item does not exist, add it to the cart
            cart.items.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async removeFromCart(userId: string, productId: string): Promise<Cart> {
        if (!userId) {
            throw new NotFoundException('User ID is required to remove from cart');
        }

        if (!productId) {
            throw new NotFoundException('Product ID is required to remove from cart');
        }

        const cart = await this.cartModel.findOne({ user: userId, isOrdered: false });

        if (!cart) {
            throw new NotFoundException('Cart not found for the given user ID');
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            throw new NotFoundException('Product not found in the cart');
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        
        await cart.save();
        return cart;
    }   
    async clearCart(userId: string): Promise<Cart> {
        if (!userId) {
            throw new NotFoundException('User ID is required to clear the cart');
        }

        const cart = await this.cartModel.findOne({ user: userId, isOrdered: false });

        if (!cart) {
            throw new NotFoundException('Cart not found for the given user ID');
        }

        // Clear the items in the cart
        cart.items = [];
        
        await cart.save();
        return cart;
    }                           


    async orderCart(userId: string): Promise<Cart> {
        if (!userId) {
            throw new NotFoundException('User ID is required to order the cart');
        }

        const cart = await this.cartModel.findOne({ user: userId, isOrdered: false });

        if (!cart) {
            throw new NotFoundException('Cart not found for the given user ID');
        }

        // Mark the cart as ordered
        cart.isOrdered = true;
        
        await cart.save();
        return cart;
    }   
}