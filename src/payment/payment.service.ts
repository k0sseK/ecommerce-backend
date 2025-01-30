import { Injectable } from '@nestjs/common'
import * as paypal from '@paypal/checkout-server-sdk'

@Injectable()
export class PaymentService {
    private client: paypal.core.PayPalHttpClient

    constructor() {
        const environment = new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
        )
        this.client = new paypal.core.PayPalHttpClient(environment)
    }

    async createOrder(amount: string) {
        const request = new paypal.orders.OrdersCreateRequest()
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                { amount: { currency_code: 'USD', value: amount } },
            ],
        })

        return this.client.execute(request)
    }
}
