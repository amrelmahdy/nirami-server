import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Brand } from './schemas/brand.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand.name)
        private brandModel: mongoose.Model<Brand>
    ) { }


    async findAll(): Promise<Brand[]> {
        const brands = await this.brandModel.find();
        return brands;
    }

    async create(brand: Brand){
        return this.brandModel.create(brand);
    }

    async findOne(query: any): Promise<Brand> {
        const vendor = await this.brandModel.findOne(query);
        if (!vendor) {
            throw new NotFoundException("Vendor not found")
        }
        return vendor;
    }

    async findById(id: string): Promise<Brand> {
        const vendor = await this.brandModel.findById(id);
        if (!vendor) {
            throw new NotFoundException("Brand not found");
        }
        return vendor;
    }
}
