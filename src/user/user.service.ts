import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userModel.findOne({
            email: createUserDto.email,
        })
        if (existingUser) {
            throw new ConflictException('Email is already in use')
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        })
        return user.save()
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec()
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec()
    }
}
