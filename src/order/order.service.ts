import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from './order.schema'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

import { CartService } from '../cart/cart.service'
import { StripeService } from '../payment/stripe/stripe.service'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private cartService: CartService,
        private stripeService: StripeService,
        private mailerService: MailerService
    ) {}

    async create(
        createOrderDto: CreateOrderDto
    ): Promise<{ order: OrderDocument; sessionId: string }> {
        const cart = await this.cartService.getCart(createOrderDto.cartId)
        if (!cart || cart.items.length === 0) {
            throw new NotFoundException("Cart is empty or doesn't exists.")
        }

        const itemsPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
        const totalPrice = itemsPrice + createOrderDto.shippingPrice

        const createdOrder = new this.orderModel({
            ...createOrderDto,
            items: cart.items,
            itemsPrice,
            totalPrice,
        })
        const savedOrder = await createdOrder.save()

        const checkoutSession = await this.stripeService.createCheckoutSession(
            savedOrder,
            createOrderDto.successUrl,
            createOrderDto.cancelUrl
        )

        // await this.sendConfirmationEmail(savedOrder);
        // await this.sendNotificationEmail(savedOrder);

        return { order: savedOrder, sessionId: checkoutSession.id }
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
                to: 'kontakt@hustwear.pl',
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
