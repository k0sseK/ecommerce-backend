import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    IsArray,
    IsOptional,
} from 'class-validator'
import { Category } from '../product.schema'

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    description?: string

    @IsEnum(Category)
    category: Category

    @IsArray()
    images: string[]

    @IsNumber()
    @Min(0)
    price: number

    @IsArray()
    quantity: { size: string; stock: number }[]
}
