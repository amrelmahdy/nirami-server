import { Controller, Post, Body, Get, Patch, Param, BadRequestException, Request, NotFoundException, UseGuards, Put } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket-dto';
import { TicketsService } from './tickets.service';
import { Ticket } from './schemas/ticket.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Order } from '../orders/schemas/order.schema';
import { EditTicketDto } from './dtos/edit-ticket-dto';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req): Promise<Ticket[]> {
        const userId = req.user?.userId;
        if (req.user?.user?.role) {
            return this.ticketsService.findAll();
        }
        return this.ticketsService.findAll(userId);
    }


    @Get(":id")
    getTicketById(@Param("id") id: string): Promise<Ticket> {
        return this.ticketsService.findById(id);
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req,
        @Body() ticket: CreateTicketDto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new NotFoundException('User ID is required to checkout');
        }
        return this.ticketsService.create(userId, ticket);
    }


    @UseGuards(JwtAuthGuard)
    @Put(':ticketId')
    async update(
        @Param('ticketId') ticketId: string,
        @Body() ticket: EditTicketDto
    ): Promise<Ticket> {
        return this.ticketsService.update(ticketId, ticket);
    }

                       
}
