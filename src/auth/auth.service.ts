import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { UsersService } from 'src/users/users.service';
import { AuthDto, JwtPayload } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    // hash password
    const hash = await argon.hash(dto.password);

    // save and return new user
    try {
      const createdUser = await this.usersService.create({
        email: dto.email,
        password: hash,
      });

      // generate and return token
      const payload = {
        sub: createdUser.id,
        email: createdUser.email,
      };

      return this.signToken(payload);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          // unique constraint violation
          throw new ConflictException(
            'User with this email already exists',
          );
        else throw new InternalServerErrorException();
      }
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.usersService.findByEmail(dto.email);

    // if user not found, throw exception
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);

    // if password incorrect, throw exception
    if (!pwMatches)
      throw new UnauthorizedException('Invalid credentials');

    // generate and return token
    const payload = { sub: user.id, email: user.email };
    return this.signToken(payload);
  }

  async signToken(
    payload: JwtPayload,
  ): Promise<{ access_token: string }> {
    const jwt = await this.jwtService.signAsync(payload);
    return {
      access_token: jwt,
    };
  }
}
