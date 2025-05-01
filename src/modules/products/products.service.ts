import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: mongoose.Model<Product>) { }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find().populate('brand reviews');
    }


    create(product: Product): Promise<Product> {
        console.log(product)
        return this.productModel.create(product)
    }
}

