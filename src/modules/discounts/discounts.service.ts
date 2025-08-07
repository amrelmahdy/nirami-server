import { Injectable } from '@nestjs/common';
import { Discount } from './schemas/dicount.schema';
import { CreateDiscountDto } from './dtos/create-discount-dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class DiscountsService {

    constructor(@InjectModel(Discount.name) private discountsModel: mongoose.Model<Discount>) { }


    async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
        console.log('Creating discount with data:', createDiscountDto);
        // Implementation for creating a discount
        return new Discount(); // Placeholder return
    }

    // Other methods like findAll, findById, update, delete can be added here
}
