import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose from 'mongoose';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: mongoose.Model<Category>) { }

    async findAll(filters: { query?: string; departmentId?: string } = {}): Promise<Category[]> {
        const { query, departmentId } = filters;
        const filter: any = {};

        if (query) {
            filter.name = { $regex: query, $options: 'i' };
        }

        
        if (departmentId) {
            if (mongoose.Types.ObjectId.isValid(departmentId)) {
                filter.department = departmentId;
            }
        }

        return await this.categoryModel.find(filter).populate("department");
    }

    async findAllByDepartment(departmentId: string): Promise<Category[]> {
        return await this.categoryModel.find({ department: departmentId }).populate("department");
    }


    async create(brand: Category) {
        return this.categoryModel.create(brand);
    }

    async findOne(query: any): Promise<Category> {
        const category = await this.categoryModel.findOne(query);
        if (!category) {
            throw new NotFoundException("Category not found")
        }
        return category;
    }

    async findById(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        return category;
    }

    async delete(id: string): Promise<Category> {
        const deleted = await this.categoryModel.findOneAndDelete({ _id: id });
        if (!deleted) {
            throw new NotFoundException("Category not found")
        }
        //this.cloudinaryService.deleteImagesFolder(`products/${deleted.slug}`)
        // const currentDirectory = process.cwd();
        // fs.remove(currentDirectory + "/assets/uploads/products/" + deleted.slug);
        return deleted;
    }
}
