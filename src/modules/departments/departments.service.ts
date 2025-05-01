import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentsService {
    constructor(@InjectModel(Department.name) private departmentModel: mongoose.Model<Department>) { }

    async findAll(): Promise<Department[]> {
        return await this.departmentModel.find();
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
}
