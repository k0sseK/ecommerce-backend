import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProductDocument = HydratedDocument<Product>

export enum Category {
    HOODIES = 'HOODIES',
    TEES = 'TEES',
    PANTS = 'PANTS',
    ACCESSORIES = 'ACCESSORIES',
}

@Schema()
export class ProductQuantity {
    @Prop({ required: true })
    size: string

    @Prop({ required: true, min: 0 })
    stock: number
}

export const ProductQuantitySchema =
    SchemaFactory.createForClass(ProductQuantity)

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string

    @Prop()
    description: string

    @Prop({ enum: Category, required: true })
    category: Category

    @Prop({ type: [String], default: [] })
    images: string[]

    @Prop({ required: true })
    price: number

    @Prop({ type: [ProductQuantitySchema], default: [] })
    quantity: ProductQuantity[]
}

export const ProductSchema = SchemaFactory.createForClass(Product)
