import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Variant } from './schemas/variant.schema';

@Injectable()
export class VariantsService {
    constructor(@InjectModel(Variant.name) private variantModel: Model<Variant>) { }

    async create(data: Variant): Promise<Variant> {
        return this.variantModel.create(data);
    }

    async findAll(): Promise<Variant[]> {
        return this.variantModel.find();
    }

    async findById(id: string): Promise<Variant> {
        const variant = await this.variantModel.findById(id);
        if (!variant) {
            throw new NotFoundException("Department not found");
        }
        return variant;
    }

    async delete(id: string) {
       const deleted = await this.variantModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException("Variant not found")
        }
        //this.cloudinaryService.deleteImagesFolder(`products/${deleted.slug}`)
        // const currentDirectory = process.cwd();
        // fs.remove(currentDirectory + "/assets/uploads/products/" + deleted.slug);
        return deleted;
    }
}
