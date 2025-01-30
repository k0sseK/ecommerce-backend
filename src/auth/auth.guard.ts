import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            'roles',
            [context.getHandler(), context.getClass()]
        )

        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers.authorization

        if (!authHeader) throw new UnauthorizedException('No token provided')

        try {
            const token = authHeader.split(' ')[1]
            const decoded = this.jwtService.verify(token)
            request.user = decoded

            if (!requiredRoles || requiredRoles.includes(decoded.role)) {
                return true
            }

            throw new UnauthorizedException('Forbidden')
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }
}
