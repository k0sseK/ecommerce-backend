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

    async createCheckoutSession(order) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card', 'blik'],
            mode: 'payment',
            success_url: `https://twoja-domena.com/order-success?orderId=${order._id}`,
            cancel_url: `https://twoja-domena.com/order-cancel`,
            line_items: order.items.map((product) => ({
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            })),
            customer_email: order.contactEmail,
            metadata: {
                orderId: order._id.toString(),
            },
        })

        return session
    }
}
