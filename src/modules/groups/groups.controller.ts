import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Group } from './schemas/group.schema';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group-dto';

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


    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.groupsService.delete(id);
    }
}
