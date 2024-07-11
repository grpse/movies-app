import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthedUserModel } from '@/auth/models/authed-user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthedUserModel | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      };
    }
    return null;
  }

  async createAccessToken(username: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(username);
    const payload = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async createUser(
    username: string,
    password: string,
  ): Promise<AuthedUserModel> {
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      username,
      hashedPassword,
    });

    return {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
