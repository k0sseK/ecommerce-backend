import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

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
export class OrderItem {
    @Prop({ type: Types.ObjectId, required: true })
    productId: Types.ObjectId

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    size: string

    @Prop({ unique: true })
    sku: string

    @Prop({ required: true })
    image: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    quantity: number
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)

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

    @Prop({ type: [OrderItemSchema], default: [] })
    items: OrderItem[]

    @Prop({ required: true, default: 0 })
    itemsPrice: number

    @Prop({ required: true, default: 0 })
    shippingPrice: number

    @Prop({ required: true, default: 0 })
    totalPrice: number

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    orderStatus: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
