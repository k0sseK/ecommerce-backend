import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'

import { UsersModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ProductModule } from './product/product.module'
import { CartModule } from './cart/cart.module'
import { OrderModule } from './order/order.module'
import { StripeModule } from './payment/stripe/stripe.module'

import { AppController } from './app.controller'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(
            process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'
        ),
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            },
            defaults: {
                from: '"HUSTWEAR" <no-reply@hustwear.pl>',
            },
        }),
        UsersModule,
        AuthModule,
        ProductModule,
        CartModule,
        OrderModule,
        StripeModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
