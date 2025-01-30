import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from './product.schema'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto)
        return createdProduct.save()
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec()
    }

    async findByCategory(category: string): Promise<Product[]> {
        return this.productModel.find({ category }).exec()
    }
}
