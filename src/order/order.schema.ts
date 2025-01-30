import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OrderDocument = Order & Document

@Schema()
export class Order {
    @Prop({ required: true })
    userId: string

    @Prop({ type: [{ productId: String, quantity: Number }] })
    items: { productId: string; quantity: number }[]

    @Prop({ required: true })
    status: string

    @Prop()
    totalPrice: number

    @Prop()
    paymentMethod: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
