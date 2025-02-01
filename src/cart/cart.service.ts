import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cart } from './cart.schema'
import { Product } from 'src/product/product.schema'
import { AddToCartDto } from './dto/add-to-cart.dto'
import config from '../config'

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name)

    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ) {}

    async getCart(cartId: string): Promise<Cart> {
        this.logger.log(
            `\x1b[34m[GET CART] Fetching cart for ID: ${cartId}\x1b[0m`
        )
        let cart = await this.cartModel
            .findOne({ cartId })
            .populate('items.productId')
            .exec()

        if (!cart) {
            this.logger.warn(
                `\x1b[33m[GET CART] Cart not found, creating new one.\x1b[0m`
            )
            cart = new this.cartModel({
                cartId,
                items: [],
                expiresAt: new Date(
                    Date.now() + config.cartExpirationDays * 24 * 60 * 60 * 1000
                ),
            })
            await cart.save()
        }

        return cart
    }

    async addToCart(cartId: string, addToCartDto: AddToCartDto): Promise<Cart> {
        this.logger.log(
            `\x1b[32m[ADD TO CART] Adding product ${addToCartDto.productId} (SKU: ${addToCartDto.sku}) to cart ${cartId}\x1b[0m`
        )
        let cart = await this.cartModel.findOne({ cartId })

        if (!cart) {
            this.logger.warn(
                `\x1b[33m[ADD TO CART] Cart not found, creating new one.\x1b[0m`
            )
            cart = new this.cartModel({
                cartId,
                items: [],
                expiresAt: new Date(
                    Date.now() + config.cartExpirationDays * 24 * 60 * 60 * 1000
                ),
            })
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.sku === addToCartDto.sku
        )

        if (itemIndex > -1) {
            this.logger.verbose(
                `\x1b[36m[ADD TO CART] Product already exists, increasing quantity. SKU: ${cart.items[itemIndex].sku}\x1b[0m`
            )
            cart.items[itemIndex].quantity += addToCartDto.quantity
        } else {
            this.logger.debug(
                `\x1b[35m[ADD TO CART] Product does not exist, adding new item with SKU: ${addToCartDto.sku}\x1b[0m`
            )
            cart.items.push(addToCartDto)
        }

        cart.expiresAt = new Date(
            Date.now() + config.cartExpirationDays * 24 * 60 * 60 * 1000
        )
        return cart.save()
    }

    async updateCartItemQuantity(
        cartId: string,
        productId: string,
        sku: string,
        quantity: number
    ): Promise<Cart> {
        this.logger.log(
            `\x1b[33m[UPDATE CART] Updating quantity of product ${productId} (SKU: ${sku}) in cart ${cartId} to ${quantity}\x1b[0m`
        )
        const cart = await this.cartModel.findOne({ cartId })
        if (!cart) throw new NotFoundException('Cart not found')

        const product = await this.productModel.findOne(
            { _id: productId, 'quantity.sku': sku },
            { 'quantity.$': 1 }
        )
        if (!product) throw new NotFoundException('Product not found')

        const availableStock = product.quantity[0]?.stock ?? 0
        if (availableStock === 0) {
            this.logger.warn(
                `\x1b[33m[UPDATE CART] Stock for ${productId} (SKU: ${sku}) is 0. Removing from cart.\x1b[0m`
            )
            cart.items = cart.items.filter((item) => item.sku !== sku)
            await cart.save()
            throw new NotFoundException({
                message: 'Product out of stock, removed from cart',
                availableStock: 0,
            })
        }

        if (quantity > availableStock) {
            this.logger.error(
                `\x1b[31m[UPDATE CART] Not enough stock. Requested: ${quantity}, Available: ${availableStock}\x1b[0m`
            )
            throw new NotFoundException({
                message: 'Not enough stock',
                availableStock,
            })
        }

        const itemIndex = cart.items.findIndex((item) => item.sku === sku)
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity
        } else {
            this.logger.error(
                `\x1b[31m[UPDATE CART] Product not found in cart.\x1b[0m`
            )
            throw new NotFoundException('Product not found in cart')
        }

        return cart.save()
    }

    async removeFromCart(
        cartId: string,
        productId: string,
        sku: string
    ): Promise<Cart> {
        this.logger.log(
            `\x1b[31m[REMOVE FROM CART] Attempting to remove product ${productId} (SKU: ${sku}) from cart ${cartId}\x1b[0m`
        )
        const cart = await this.cartModel.findOne({ cartId })
        if (!cart) throw new NotFoundException('Cart not found')

        const initialLength = cart.items.length
        cart.items = cart.items.filter((item) => item.sku !== sku)

        if (cart.items.length === initialLength) {
            this.logger.warn(
                `\x1b[31m[REMOVE FROM CART] Product not found in cart.\x1b[0m`
            )
            throw new NotFoundException('Product not found in cart')
        }

        this.logger.log(
            `\x1b[32m[REMOVE FROM CART] Product removed successfully.\x1b[0m`
        )
        return cart.save()
    }

    async clearCart(cartId: string): Promise<void> {
        this.logger.log(`\x1b[31m[CLEAR CART] Clearing cart ${cartId}\x1b[0m`)
        await this.cartModel.findOneAndDelete({ cartId })
    }
}
