import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import mongoose from 'mongoose';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {

    constructor(
        @InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>,
        @InjectModel(Product.name) private productModel: mongoose.Model<Product>
    ) { }


    async getCart(userId: string): Promise<Cart> {
        if (!userId) {
            throw new Error('User ID is required to retrieve the cart');
        }

        const cart = await this.cartModel.findOne({ user: userId, isOrdered: false })
            .populate({
                path: 'items.product',
                populate: { path: 'brand' }
            });

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

        const product = await this.productModel.findById(productId);

        if (!product) {
            throw new NotFoundException('Unable to find product with the given ID');
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
            cart.items.push({
                product: new mongoose.Types.ObjectId(productId),
                quantity: 1,
                unitPrice: product.isOnSale && product.salesPrice != null ? product.salesPrice : product.price,
            });
        }

        await cart.save();
        return cart;
    }

    async removeFromCart(userId: string, productId: string, removeCompletely?: boolean): Promise<Cart> {
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

        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex > -1) {
            // If the item already exists, increment the quantity
            if (cart.items[existingItemIndex].quantity > 1 && !removeCompletely) {
                cart.items[existingItemIndex].quantity -= 1;

            } else if (cart.items[existingItemIndex].quantity === 1 || removeCompletely) {
                // Remove the item from the cart
                cart.items.splice(existingItemIndex, 1);

            }
        } else {
            throw new NotFoundException('Product not found in the cart');
        }

        // If cart is now empty, remove discount
        if (cart.items.length === 0) {
            cart.discount = undefined;
        }


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
        // Remove discount if cart is empty
        cart.discount = undefined;

        await cart.save();
        return cart;
    }


    async applyDiscountByCartId(cartId: string, discountCode: string): Promise<Cart> {
        if (!cartId) {
            throw new NotFoundException('Cart ID is required to apply discount');
        }
        if (!discountCode) {
            throw new NotFoundException('Discount code is required to apply discount');
        }

        // Fetch the cart first
        const cart = await this.cartModel.findById(cartId);
        if (!cart) {
            throw new NotFoundException('Cart not found for the given cart ID');
        }

        // Example: Lookup discount details (replace with real logic as needed)
        // For demonstration, assume all codes are 10% off
        cart.discount = {
            code: discountCode,
            discountType: 'fixed',
            value: 10
        };

        // Save to trigger pre('save') and recalculate totals/discounts
        await cart.save();

        // Ensure finalPrice is up-to-date after discount is applied
        // (finalPrice is recalculated in the pre('save') hook)
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