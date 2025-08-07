import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { departmentSchema } from './schemas/department.schema';
import { CategoriesModule } from '../categories/categories.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Department", schema: departmentSchema }]),
    CategoriesModule,
    CloudinaryModule
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController]
})
export class DepartmentsModule { }
