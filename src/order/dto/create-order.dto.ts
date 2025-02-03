import {
    IsNotEmpty,
    IsEmail,
    IsString,
    IsIn,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
} from 'class-validator'

export class CreateOrderDto {
    @IsEmail()
    @IsNotEmpty()
    contactEmail: string

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    postalCode: string

    @IsString()
    @IsNotEmpty()
    city: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsIn(['inpost_courier', 'inpost_parcel_locker'])
    @IsNotEmpty()
    shippingMethod: string

    @IsOptional()
    @IsString()
    parcelLocker?: string

    @IsIn(['blik', 'bank_transfer', 'paypal'])
    @IsNotEmpty()
    paymentMethod: string

    @IsArray()
    @ValidateNested({ each: true })
    products: { productId: string; quantity: number }[]

    @IsNumber()
    @Min(0)
    totalPrice: number
}
