import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product } from './product.schema'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto)
        return createdProduct.save()
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec()
    }

    async findOne(id: string): Promise<Product | null> {
        return this.productModel.findById(id).exec()
    }

    async findLast(limit: number) {
        return this.productModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec()
    }

    async findByCategory(category: string): Promise<Product[]> {
        return this.productModel.find({ category }).exec()
    }
}
