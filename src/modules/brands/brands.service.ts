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
        const brand = await this.brandModel.findById(id);
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return brand;
    }


    async update(id: string, brand: Brand): Promise<Brand> {
        const updatedBrand = await this.brandModel.findByIdAndUpdate(id, brand, { new: true });
        if (!updatedBrand) {
            throw new NotFoundException("Brand not found");
        }
        return updatedBrand;                
    }
}
