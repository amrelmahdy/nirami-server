import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { departmentSchema } from './schemas/department.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports:[
    CategoriesModule,
    MongooseModule.forFeature([{ name: "Department",schema: departmentSchema }])],
  providers: [DepartmentsService],
  controllers: [DepartmentsController]
})
export class DepartmentsModule {}
