import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User as SchemaUser } from '@prisma/client';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
}

export interface JwtVerifyPayload extends JwtPayload {
  iat: number;
  exp: number;
}

export type User = Omit<SchemaUser, 'password'>;
