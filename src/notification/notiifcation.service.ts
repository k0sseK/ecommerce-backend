import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class NotificationService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })

    async sendOrderConfirmation(email: string, orderDetails: any) {
        return this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Potwierdzenie zamówienia',
            text: `Twoje zamówienie zostało przyjęte: ${JSON.stringify(orderDetails)}`,
        })
    }
}
