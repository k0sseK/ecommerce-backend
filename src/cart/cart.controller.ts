import { Controller, Get, Post, Delete, Param, Body, Put } from '@nestjs/common'
import { CartService } from './cart.service'
import { AddToCartDto } from './dto/add-to-cart.dto'

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':cartId')
    async getCart(@Param('cartId') cartId: string) {
        return this.cartService.getCart(cartId)
    }

    @Post(':cartId')
    async addToCart(
        @Param('cartId') cartId: string,
        @Body() addToCartDto: AddToCartDto
    ) {
        return this.cartService.addToCart(cartId, addToCartDto)
    }

    @Put(':cartId/:productId/:sku')
    async updateCartItemQuantity(
        @Param('cartId') cartId: string,
        @Param('productId') productId: string,
        @Param('sku') sku: string,
        @Body('quantity') quantity: number
    ) {
        return this.cartService.updateCartItemQuantity(
            cartId,
            productId,
            sku,
            quantity
        )
    }

    @Delete(':cartId/:productId/:sku')
    async removeFromCart(
        @Param('cartId') cartId: string,
        @Param('productId') productId: string,
        @Param('sku') sku: string
    ) {
        return this.cartService.removeFromCart(cartId, productId, sku)
    }

    @Delete(':cartId')
    async clearCart(@Param('cartId') cartId: string) {
        return this.cartService.clearCart(cartId)
    }
}
