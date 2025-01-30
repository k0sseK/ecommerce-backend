import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './user.service'
import { UsersController } from './user.controller'
import { User, UserSchema } from './user.schema'
import { AuthModule } from '../auth/auth.module'
import { AuthGuard } from '../auth/auth.guard'
import { JwtService } from '@nestjs/jwt'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthGuard, JwtService],
    exports: [UsersService],
})
export class UsersModule {}
