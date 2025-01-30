import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './user.service'
import { CreateUserDto, UserRole } from './dto/create-user.dto'
import { AuthGuard } from '../auth/auth.guard'
import { Roles } from '../auth/roles.decorator'
import { User } from './user.schema'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN)
    async findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }
}
