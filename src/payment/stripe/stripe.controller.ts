import { Controller, Get } from '@nestjs/common'
import { StripeService } from './stripe.service'

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Get('test')
    async testStripe() {
        const paymentIntent = await this.stripeService.createPaymentIntent(1000) // 10 zł = 1000 groszy
        return {
            message: 'Stripe PaymentIntent created successfully',
            client_secret: paymentIntent.client_secret,
        }
    }
}
