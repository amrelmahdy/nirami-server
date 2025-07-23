import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import mongoose from 'mongoose';

@Injectable()
export class TicketsService {
    constructor(@InjectModel(Ticket.name) private ticketModel: mongoose.Model<Ticket>) { }



    async findAll(): Promise<Ticket[]> {
        return this.ticketModel.find().populate('order');
    }

    async create(ticket: Ticket): Promise<Ticket> {
        // Validate required fields
        if (!ticket.name || !ticket.email || !ticket.order) {
            throw new Error('Name, email, and order are required fields');
        }

        // Create a new ticket
        return this.ticketModel.create(ticket);
    }
}
