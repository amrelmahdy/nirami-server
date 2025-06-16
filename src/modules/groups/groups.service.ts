import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Group } from './schemas/group.schema';

@Injectable()
export class GroupsService {
    constructor(@InjectModel(Group.name) private groupModel: mongoose.Model<Group>) { }

    async findAll(filters: { query?: string; categoryId?: string } = {}): Promise<Group[]> {
        const { query, categoryId } = filters;
        const filter: any = {};

        if (query) {
            filter.name = { $regex: query, $options: 'i' };
        }


        if (categoryId) {
            if (mongoose.Types.ObjectId.isValid(categoryId)) {
                filter.category = categoryId;
            }
        }
        return await this.groupModel.find(filter).populate("category");
    }

    async create(group: Group) {
        return this.groupModel.create(group);
    }

    async findOne(query: any): Promise<Group> {
        const group = await this.groupModel.findOne(query);
        if (!group) {
            throw new NotFoundException("Group not found")
        }
        return group;
    }

    async findById(id: string): Promise<Group> {
        const group = await this.groupModel.findById(id);
        if (!group) {
            throw new NotFoundException("Group not found");
        }
        return group;
    }

    async delete(id: string): Promise<Group> {
        const deleted = await this.groupModel.findOneAndDelete({ _id: id });
        if (!deleted) {
            throw new NotFoundException("Group not found")
        }
        //this.cloudinaryService.deleteImagesFolder(`products/${deleted.slug}`)
        // const currentDirectory = process.cwd();
        // fs.remove(currentDirectory + "/assets/uploads/products/" + deleted.slug);
        return deleted;
    }
}
