import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  // Create new user
  async create(data: AuthDto) {
    return this.db.user.create({
      data,
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }

  // Get all users
  async getAll() {
    return this.db.user.findMany({
      omit: {
        password: true, // exclude password from the response
      },
    });
  }

  // Get user by email
  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Get user by id
  async findById(id: string) {
    return this.db.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true, // exclude password from the response
      },
    });
  }
}
