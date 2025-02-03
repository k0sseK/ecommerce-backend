import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OrderDocument = Order & Document

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
}

export enum PaymentMethod {
    BLIK = 'blik',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
}

export enum ShippingMethod {
    INPOST_COURIER = 'inpost_courier',
    INPOST_LOCKER = 'inpost_locker',
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    contactEmail: string

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string

    @Prop({ required: true })
    address: string

    @Prop({ required: true })
    postalCode: string

    @Prop({ required: true })
    city: string

    @Prop({ required: true })
    phone: string

    @Prop({ required: true, enum: ShippingMethod })
    shippingMethod: ShippingMethod

    @Prop()
    parcelLocker?: string

    @Prop({ required: true, enum: PaymentMethod })
    paymentMethod: PaymentMethod

    @Prop({ required: true, type: [{ productId: String, quantity: Number }] })
    products: { productId: string; quantity: number }[]

    @Prop({ required: true })
    totalPrice: number

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    orderStatus: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
