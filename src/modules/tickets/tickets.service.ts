import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import mongoose from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import e from 'express';

@Injectable()
export class TicketsService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: mongoose.Model<Ticket>,
        @InjectModel(Order.name) private OrderModel: mongoose.Model<Order>
    ) { }


    async findAll(): Promise<Ticket[]> {
        return this.ticketModel.find();
    }

    async create(ticket: Ticket): Promise<Ticket> {
        if (!ticket.name || !ticket.email || !ticket.orderNumber) {
            throw new Error('Name, email, and order are required fields');
        }
        const orderWthSameNumer = await this.OrderModel.findOne({
            orderNumber: ticket.orderNumber
        });

        if (!orderWthSameNumer) {
            throw new NotFoundException('Order not found');
        }

        // Check if a ticket already exists for this orderNumber with status pending or processing
        const existingTicket = await this.ticketModel.findOne({
            orderNumber: ticket.orderNumber,
            status: { $in: ['pending', 'processing'] }
        });
        if (existingTicket) {
            throw new ConflictException('A ticket for this order with status pending or processing already exists');
        }

        return this.ticketModel.create(ticket);
    }
}
