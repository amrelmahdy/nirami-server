import { Controller, Post, Body, Get, Patch, Param, BadRequestException } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket';
import { TicketsService } from './tickets.service';
import { Ticket } from './schemas/ticket.schema';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) { }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }

    @Post()
    create(@Body() ticket: CreateTicketDto) {
        return this.ticketsService.create(ticket);
    }

    // // update the status of a ticket
    // @Patch(':id/status')
    // updateStatus(@Param('id') id: string, @Body() status: Ticket ) {
    //     if (!status || !status.status) {
    //         throw new BadRequestException('Status is required');
    //     }                                                              
    //     return this.ticketsService.updateStatus(id, status);     
    // }                        
}
