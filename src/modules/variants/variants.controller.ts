import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dtos/create-variant-dto';
import { Variant } from './schemas/variant.schema';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  create(@Body() body: CreateVariantDto): Promise<Variant> {
    return this.variantsService.create(body);
  }

  @Get()
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantsService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.variantsService.delete(id);
  }
}
