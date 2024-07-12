import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomString } from 'test/utils/randomString';
import { AuthModule } from './auth.module';
import { Response } from 'express';

describe('auth > AuthController > integration >', () => {
  let controller: AuthController;
  let authService: AuthService;
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should signup and account and login', async () => {
    const username = randomString(7);
    const password = randomString(7);

    const signup = await controller.signup({ username, password });
    const user = await authService.validateUser(username, password);
    const login = await controller.login(
      { username: user.username, password },
      {
        setHeader: () => {},
        json: () => {},
      } as any as Response,
    );

    expect(signup).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username,
      }),
    );
    expect(login).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });

  it('should fail to login with invalid password', async () => {
    const username = randomString(7);
    const password = randomString(7);

    await controller.signup({ username, password });

    await expect(
      localStrategy.validate(username, 'invalid password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should fail to signup with an existing user', async () => {
    const username = randomString(7);
    const password = randomString(7);

    await controller.signup({ username, password });

    await expect(controller.signup({ username, password })).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
