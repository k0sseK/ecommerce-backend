import { Inject, Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
    private stripe: Stripe
    private readonly logger = new Logger(StripeService.name)

    constructor(@Inject('STRIPE_API_KEY') private apiKey: string) {
        this.stripe = new Stripe(this.apiKey, {
            apiVersion: '2025-01-27.acacia',
        })
        this.logger.log(
            'StripeService initialized with API version 2025-01-27.acacia'
        )
    }

    async createPaymentIntent(
        amount: number,
        currency: string = 'pln'
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                payment_method_types: ['card', 'blik'],
            })
            return paymentIntent
        } catch (error) {
            this.logger.error('Error creating PaymentIntent', error)
            throw error
        }
    }
}
