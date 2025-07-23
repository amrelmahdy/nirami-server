import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket';
import { TicketsService } from './tickets.service';

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
}
