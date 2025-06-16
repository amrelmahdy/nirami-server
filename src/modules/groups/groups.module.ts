import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { groupSchema } from './schemas/group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Group', schema: groupSchema }])],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService]
})
export class GroupsModule { }
