import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from './order.schema'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { StripeModule } from '../payment/stripe/stripe.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        StripeModule.forRootAsync(),
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
