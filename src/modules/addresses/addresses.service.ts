import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Address } from './schemas/address.schema';

@Injectable()
export class AddressesService {
    constructor(@InjectModel(Address.name) private addressModel: mongoose.Model<Address>) { }

    async findAll(userId: string): Promise<Address[]> {
        return await this.addressModel.find({ user: userId })
            .populate("user")
            .sort({ createdAt: -1 });
    }

    async create(address: Address, userId: string): Promise<Address> {

        // if isDefault is Provided, set is default to false for all other addresses of the user
        if (address.isDefault) {
            await this.addressModel.updateMany(
                { user: userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }
        // Create a new address with the userId
        // This assumes that the address schema has a user field of type mongoose.Schema.Types.ObjectId
        if (!userId) {
            throw new Error('User ID is required to create an address');
        }
        if (!address.name || !address.phone || !address.deliveryAddress) {
            throw new Error('Name, phone, and delivery address are required fields');
        }
        if (!address.location || !address.location.lat || !address.location.lng) {
            throw new Error('Location with latitude and longitude is required');
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const newAddress = {
            ...address,
            user: userId
        }
        return this.addressModel.create(newAddress);
    }


    async update(id: string, address: Address): Promise<Address> {
        // Find the address first
        const existingAddress = await this.addressModel.findById(id);
        if (!existingAddress) {
            throw new Error('Address not found');
        }

        // If isDefault is provided, set isDefault to false for all other addresses of the user
        if (address.isDefault) {
            await this.addressModel.updateMany(
                { user: existingAddress.user, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        // Update the address
        const updatedAddress = await this.addressModel.findByIdAndUpdate(id, address, { new: true }).populate("user");
        if (!updatedAddress) {
            throw new Error('Address not found');
        }

        return updatedAddress;
    }


    async findById(id: string): Promise<Address> {
        const address = await this.addressModel.findById(id).populate("user");
        if (!address) {
            throw new Error('Address not found');
        }
        return address;
    }
}
