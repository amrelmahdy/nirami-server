import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../categories/schemas/category.schema'; // adjust path as needed
import { CategoriesService } from '../categories/categories.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectModel(Department.name) private departmentModel: mongoose.Model<Department>,
        private categoriesService: CategoriesService,
        private cloudinaryService: CloudinaryService,

        //@InjectModel(Category.name) private categoryModel: mongoose.Model<Category>, // inject Category model
    ) { }

    async findAll(): Promise<any[]> {
        const departments = await this.departmentModel.find().populate('categories');;
        return departments;
        // // Attach categories for each department
        // const departmentsWithCategories = await Promise.all(
        //     departments.map(async (department) => {
        //         const categories = await this.categoriesService.findAllByDepartment(department._id.toString());
        //         return {
        //             ...department.toObject(),
        //             categories,
        //         };
        //     })
        // );
        // return departmentsWithCategories;
    }

    async create(brand: Department) {
        return this.departmentModel.create(brand);
    }

    async findOne(query: any): Promise<Department> {
        const department = await this.departmentModel.findOne(query);
        if (!department) {
            throw new NotFoundException("Department not found")
        }
        return department;
    }

    async findById(id: string): Promise<Department> {
        const department = await this.departmentModel.findById(id);
        if (!department) {
            throw new NotFoundException("Department not found");
        }
        return department;
    }


    async delete(id: string): Promise<Department> {
        const deleted = await this.departmentModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException("Department not found");
        }

        const imageUrl = deleted.image;

        if (imageUrl) {
            const lastPart = imageUrl.split('/').pop();

            if (lastPart) {
                const fileNameWithoutExtension = lastPart.split('.').slice(0, -1).join('.');

                // Ensure filename isn't empty before calling Cloudinary delete
                if (fileNameWithoutExtension) {
                    await this.cloudinaryService.deleteImagesFolder(`departments/${fileNameWithoutExtension}`);
                }
            }
        }

        return deleted;
    }

}
