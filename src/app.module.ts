import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './product/product.module'
import { CartModule } from './cart/cart.module'
import { OrderModule } from './order/order.module'
import { PaymentModule } from './payment/payment.module'
import { NotificationModule } from './notification/notification.module'

import { AppController } from './app.controller'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(
            process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'
        ),
        ProductModule,
        CartModule,
        OrderModule,
        PaymentModule,
        NotificationModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
