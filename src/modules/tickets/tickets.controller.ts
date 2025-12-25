import { Controller, Post, Body, Get, Patch, Param, BadRequestException, Request, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket-dto';
import { TicketsService } from './tickets.service';
import { Ticket } from './schemas/ticket.schema';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) { }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }


    @Get("user")
    getTicketsByUserId(): Promise<Ticket[]> {
        return this.ticketsService.findTicketsByUserId();
    }

    @Get(":id")
    getTicketById(@Param("id") id: string): Promise<Ticket> {
        return this.ticketsService.findById();
    }



    @Post()
    create(@Request() req,
        @Body() ticket: CreateTicketDto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to checkout');
        }
        return this.ticketsService.create(ticket, userId);
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
