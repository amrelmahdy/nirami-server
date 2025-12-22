import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Group } from './schemas/group.schema';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group-dto';
import { EditGroupDto } from './dtos/edit-group-dto';

@Controller('groups')
export class GroupsController {
    constructor(private groupsService: GroupsService) { }

    @Get()
    getAllGroups(
        @Query('query') query?: string,
        @Query('categoryId') categoryId?: string
    ): Promise<Group[]> {
        return this.groupsService.findAll({ query, categoryId });
    }


    @Post()
    cretae(@Body() group: CreateGroupDto) {
        return this.groupsService.create(group);
    }


    @Get(":id")
    getBrandById(@Param("id") id: string): Promise<Group> {
        return this.groupsService.findById(id);
    }



    @Put(":id")
    updateBrand(@Param("id") id: string, @Body() group: EditGroupDto): Promise<Group> {
        return this.groupsService.update(id, group);
    }


    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.groupsService.delete(id);
    }
}
