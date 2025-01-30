import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator'

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    password: string

    @IsEnum(UserRole)
    role: UserRole
}
