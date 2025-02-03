import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from './order.schema'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

import { MailerService } from '@nestjs-modules/mailer'
import { StripeService } from '../payment/stripe/stripe.service'

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private mailerService: MailerService,
        private stripeService: StripeService
    ) {}

    async create(
        createOrderDto: CreateOrderDto
    ): Promise<{ order: OrderDocument; paymentIntent: any }> {
        const createdOrder = new this.orderModel(createOrderDto)
        const savedOrder = await createdOrder.save()

        const amountInGrosze = savedOrder.totalPrice * 100
        const paymentIntent = await this.stripeService.createPaymentIntent(
            amountInGrosze,
            'pln'
        )

        await this.sendConfirmationEmail(savedOrder)
        await this.sendNotificationEmail(savedOrder)

        return { order: savedOrder, paymentIntent }
    }

    async findAll(): Promise<OrderDocument[]> {
        return this.orderModel.find().exec()
    }

    async findOne(id: string): Promise<OrderDocument> {
        const order = await this.orderModel.findById(id).exec()
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`)
        }
        return order
    }

    async update(
        id: string,
        updateOrderDto: UpdateOrderDto
    ): Promise<OrderDocument> {
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, updateOrderDto, { new: true })
            .exec()
        if (!updatedOrder) {
            throw new NotFoundException(`Order with id ${id} not found`)
        }
        return updatedOrder
    }

    async remove(id: string): Promise<OrderDocument> {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec()
        if (!deletedOrder) {
            throw new NotFoundException(`Order with id ${id} not found`)
        }
        return deletedOrder
    }

    private async sendConfirmationEmail(order: OrderDocument) {
        try {
            await this.mailerService.sendMail({
                to: order.contactEmail,
                subject: 'Potwierdzenie zamówienia',
                text: `Dziękujemy za złożenie zamówienia. Numer zamówienia: ${order._id}`,
                html: `<p>Dziękujemy za złożenie zamówienia. Numer zamówienia: <strong>${order._id}</strong></p>`,
            })
            console.log(
                `Wysłano potwierdzenie zamówienia do ${order.contactEmail}`
            )
        } catch (error) {
            console.error('Błąd przy wysyłaniu potwierdzenia email:', error)
        }
    }

    private async sendNotificationEmail(order: OrderDocument) {
        try {
            await this.mailerService.sendMail({
                to: 'firmowy_email@example.com', // zastąp swoim firmowym emailem
                subject: 'Nowe zamówienie',
                text: `Nowe zamówienie złożone. Numer zamówienia: ${order._id}`,
                html: `<p>Nowe zamówienie złożone. Numer zamówienia: <strong>${order._id}</strong></p>`,
            })
            console.log(
                'Powiadomienie o nowym zamówieniu wysłane do firmowego emaila'
            )
        } catch (error) {
            console.error('Błąd przy wysyłaniu powiadomienia email:', error)
        }
    }
}
