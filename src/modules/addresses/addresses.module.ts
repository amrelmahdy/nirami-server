import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Mongoose } from 'mongoose';
import { Address, addressSchema } from './schemas/address.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Address.name, schema: addressSchema }])],
  controllers: [AddressesController],
  providers: [AddressesService]
})
export class AddressesModule { }
