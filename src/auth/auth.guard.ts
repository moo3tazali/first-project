import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtVerifyPayload } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the context
    const request = context.switchToHttp().getRequest<Request>();

    // Extract the token from the request header
    const token = this.extractTokenFromHeader(request);

    // If no token is found, throw an unauthorized exception
    if (!token) {
      throw new UnauthorizedException();
    }

    // Verify the token using the secret key
    try {
      // Extract the payload from the token
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload =
        await this.jwtService.verifyAsync<JwtVerifyPayload>(token, {
          secret,
        });

      // Find the user in the database using the payload sub
      const user = await this.usersService.findById(payload.sub);

      // If the user is not found, throw an unauthorized exception
      if (!user) {
        throw new UnauthorizedException();
      }

      // Set the user on the request object
      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
