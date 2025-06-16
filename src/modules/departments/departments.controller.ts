import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dtos/create-department-dto';
import { Department } from './schemas/department.schema';

@Controller('departments')
export class DepartmentsController {
    constructor(private departmentsService: DepartmentsService) { }

    @Get()
    getAllBrands(): Promise<Department[]> {
        return this.departmentsService.findAll();
    }


    @Post()
    cretae(@Body() brand: CreateDepartmentDto) {
        return this.departmentsService.create(brand);
    }


    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.departmentsService.delete(id);
    }
}
