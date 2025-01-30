import { Module } from '@nestjs/common'
import { NotificationService } from './notiifcation.service'

@Module({
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
