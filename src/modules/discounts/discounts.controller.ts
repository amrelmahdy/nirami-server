import { Body, Controller, Post } from '@nestjs/common';
import { Discount } from './schemas/dicount.schema';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dtos/create-discount-dto';

@Controller('discounts')
export class DiscountsController {

    constructor(private discountsService: DiscountsService) { }


    @Post()
    async createDiscount(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
        return this.discountsService.create(createDiscountDto);
    }
    // @Get()
    // async getAllDiscounts(): Promise<Discount[]> {                   
    //     return this.discountsService.findAll();
    // }    
    // @Get(':id')
    // async getDiscountById(@Param('id') id: string): Promise<Discount


    // ) {  //     return this.discountsService.findById(id);           

    // }    


    // @Put(':id')              
    // async updateDiscount(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto): Promise<Discount> {             
    //     return this.discountsService.update(id, updateDiscountDto);
    // }                
    // @Delete(':id')           

    // async deleteDiscount(@Param('id') id: string): Promise<Discount> {
    //     return this.discountsService.delete(id);             
    // }
    // }                
    // return this.addressesService.delete(id, userId);


}
