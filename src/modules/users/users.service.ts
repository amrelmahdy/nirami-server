import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './schemas/user.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { ProductsService } from 'src/products/products.service';

const bcryptjs = require('bcryptjs')

export enum Role {
    User = 'user',
    Admin = 'admin',
}

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private usersModel: mongoose.Model<User>,
        // private productsService: ProductsService
    ) { }

    async getAll(): Promise<User[]> {
        const users = await this.usersModel.find({});
        return users
    }


    async register(user: User): Promise<User> {
        const res = await this.usersModel.create({ ...user,  role: UserRole.USER });
        return res
    }

    async create(user: User): Promise<User> {
        const { email, phone } = user;
        const userIsTaken = await this.findByEmailOrPhone(email, phone)
        if (userIsTaken) {
            throw new BadRequestException("User has already been taken.")
        }

        const salt = await bcryptjs.genSalt(10);

        const hash = await bcryptjs.hash(user.password, salt)

        const res = await this.usersModel.create({ ...user, password: hash, role: UserRole.ADMIN });

        return res
    }


    async findById(id: string): Promise<User> {
        const user = await this.usersModel.findById(id)
            .populate('favList addresses');
        if (!user) {
            throw new NotFoundException("User not found.");
        }
        return user
    }



    async findByEmailOrPhone(email?: string, phone?: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ "$or": [{ email: email }, { phone: phone }] })
        // .populate("wish_list");
        return user;
    }

    // async update(id: string, user: any, extras?: any): Promise<User> {
    // const updatedUser = await this.usersModel.findByIdAndUpdate(
    //     { _id: id },
    //     { $set: { ...user }, ...extras },
    //     { new: true }
    // );
    // return updatedUser
    // }


    async update(id, body): Promise<User> {
        const user = await this.usersModel.findById(id);
        if (!user) {
            throw new NotFoundException("User not found.");
        }

        // // If password is provided, hash it
        // if (body.password) {
        //     const salt = await bcryptjs.genSalt(10);
        //     body.password = await bcryptjs.hash(body.password, salt);
        // }

        // Update the user
        const updatedUser = await this.usersModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedUser) {
            throw new NotFoundException("User not found.");
        }
        return updatedUser;
    }

    async delete(id: string): Promise<User> {
        const user = await this.usersModel.findOneAndDelete({ _id: id });
        if (!user) {
            throw new NotFoundException("User not found.");
        }
        return user
    }


    // async addTotWishList(username: string, productId: string) {
    //     const product = await this.productsService.findById(productId);
    //     if (!product) {
    //         throw new NotFoundException("Product not found.");
    //     }

    //     // Find the user and check if the product is already in the wishlist
    //     const user = await this.usersModel.findOne(
    //         { "$or": [{ email: username }, { phone: username }] }
    //     );

    //     if (!user) {
    //         throw new NotFoundException("User not found.");
    //     }

    //     const isProductInWishlist = user.wish_list.some((wishlistProduct) => wishlistProduct.toString() === productId.toString());
    //     const filter = { "$or": [{ email: username }, { phone: username }] };

    //     const updateOperation = isProductInWishlist
    //     ? { $pull: { wish_list: productId } }
    //     : { $addToSet: { wish_list: productId } };


    //     const userUpdated = await this.usersModel.findOneAndUpdate(filter, updateOperation, { new: true }).populate("addresses wish_list");

    //     if (!userUpdated) {
    //         throw new NotFoundException("Failed to update user wishlist.");
    //     }

    //     return userUpdated;
    // }

}
