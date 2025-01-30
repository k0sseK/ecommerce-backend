import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UserRole } from './dto/create-user.dto'

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, enum: UserRole, default: UserRole.USER })
    role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)
