import { IsString, IsNumber, IsNotEmpty } from 'class-validator'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    description: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    category: string

    @IsString()
    imageUrl: string
}
