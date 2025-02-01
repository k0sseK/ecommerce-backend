import { IsNotEmpty, IsMongoId, IsString, IsNumber, Min } from 'class-validator'
import { Types } from 'mongoose'

export class AddToCartDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    size: string

    @IsString()
    @IsNotEmpty()
    sku: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsNumber()
    @Min(0)
    price: number

    @IsNumber()
    @Min(1)
    quantity: number
}
