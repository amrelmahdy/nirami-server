import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dtos/create-address-dto';
import { Address } from './schemas/address.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
export class AddressesController {

    constructor(private addressesService: AddressesService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllBrands(@Request() req): Promise<Address[]> {
        const userId = req.user?.userId;
        return this.addressesService.findAll(userId);
    }


    @Post()
    @UseGuards(JwtAuthGuard)
    async cretae(
        @Request() req,
        @Body() address: CreateAddressDto
    ): Promise<Address> {
        const userId = req.user?.userId;
        return this.addressesService.create(address, userId);
    }

    @Put(':id')
    async updateAddress(
        @Param('id') id: string,
        @Body() address: CreateAddressDto
    ): Promise<Address> {
        return this.addressesService.update(id, address);
    }

    @Get(':id')
    async getAddressById(@Param('id') id: string): Promise<Address> {
        return this.addressesService.findById(id);
    }

    // deleteAddress
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteAddress(@Param('id') id: string, @Request() req): Promise<Address> {
        const userId = req.user?.userId;
        return this.addressesService.delete(id, userId);
    }
}


