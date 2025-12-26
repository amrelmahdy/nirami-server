import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import mongoose from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import e from 'express';
import { CreateTicketDto } from './dtos/create-ticket-dto';
import { EditTicketDto } from './dtos/edit-ticket-dto';

@Injectable()
export class TicketsService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: mongoose.Model<Ticket>,
        @InjectModel(Order.name) private OrderModel: mongoose.Model<Order>
    ) { }


    async findAll(userId?: string): Promise<Ticket[]> {
        if (!userId) {
            return this.ticketModel.find();
        }
        return this.ticketModel.find({ user: userId });
    }

    async create(userId: string, ticket: CreateTicketDto): Promise<Ticket> {
        if (!userId) {
            throw new NotFoundException('User ID is required');
        }

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
            status: { $in: ['created', 'processing'] }
        });
        if (existingTicket) {
            throw new ConflictException('A ticket for this order with status pending or processing already exists');
        }

        return this.ticketModel.create({ ...ticket, user: userId });
    }

    async findTicketsByUserId(): Promise<Ticket[]> {
        // For demonstration, using a hardcoded userId. In a real application, retrieve this from the authenticated user context.
        const userId = '64a7f0c2e1b2c8b1a1a1a1a1'; // Replace with actual user ID retrieval logic

        return this.ticketModel.find({ userId: userId });
    }



    async findById(id: string): Promise<Ticket> {
        const ticket = await this.ticketModel.findById(id).populate('user');
        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }
        return ticket;
    }


    async update(id: string, ticket: EditTicketDto): Promise<Ticket> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Promise.reject(new NotFoundException("Order not found"));
        }

        const updatedTicket = await this.ticketModel.findByIdAndUpdate(id, ticket, { new: true });

        if (!updatedTicket) {
            throw new NotFoundException("Ticket not found");
        }
        return updatedTicket;
    }



}
