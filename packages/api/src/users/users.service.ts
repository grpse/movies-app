import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: CreateUserDto): Promise<User> {
    if (!data.username || !data.hashedPassword) {
      throw new Error('Invalid data');
    }

    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.hashedPassword,
      },
    });
  }
}
