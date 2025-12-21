import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dtos/create-department-dto';
import { Department } from './schemas/department.schema';
import { EditDepartmentDto } from './dtos/edit-department-dto';

@Controller('departments')
export class DepartmentsController {
    constructor(private departmentsService: DepartmentsService) { }

    @Get()
    getAllBrands(): Promise<Department[]> {
        return this.departmentsService.findAll();
    }


    @Post()
    cretae(@Body() department: CreateDepartmentDto) {
        return this.departmentsService.create(department);
    }


    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() product: EditDepartmentDto
    ): Promise<Department> {
        return this.departmentsService.update(id, product);
    }



    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.departmentsService.delete(id);
    }
}
