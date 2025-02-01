import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

import config from '../config'

@Schema({ timestamps: true })
export class CartItem {
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

export const CartItemSchema = SchemaFactory.createForClass(CartItem)

@Schema({ timestamps: true })
export class Cart extends Document {
    @Prop({ required: true, unique: true })
    cartId: string

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[]

    @Prop({
        type: Date,
        default: () =>
            new Date(
                Date.now() + config.cartExpirationDays * 24 * 60 * 60 * 1000
            ),
        index: { expires: `${config.cartExpirationDays}d` },
    })
    expiresAt: Date
}

export const CartSchema = SchemaFactory.createForClass(Cart)
