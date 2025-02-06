import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsNumber,
    Min,
} from 'class-validator'
import { PaymentMethod, ShippingMethod } from '../order.schema'

export class CreateOrderDto {
    @IsString()
    cartId: string

    @IsEmail()
    contactEmail: string

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    address: string

    @IsString()
    postalCode: string

    @IsString()
    city: string

    @IsString()
    phone: string

    @IsEnum(ShippingMethod)
    shippingMethod: ShippingMethod

    @IsOptional()
    @IsString()
    parcelLocker?: string

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod

    @IsNumber()
    @Min(0)
    shippingPrice: number

    @IsString()
    successUrl: string

    @IsString()
    cancelUrl: string
}
