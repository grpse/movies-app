import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { randomString } from 'test/utils/randomString';
import { AuthedUserModel } from './models/authed-user.model';

describe('auth > AuthService > integration >', () => {
  const createNewUser = async (): Promise<{
    createdUser: AuthedUserModel;
    username: string;
    password: string;
    service: AuthService;
  }> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    const service = module.get<AuthService>(AuthService);
    const username = randomString(7);
    const password = randomString(7);
    const createdUser = await service.createUser(username, password);

    return {
      createdUser,
      username,
      password,
      service,
    };
  };

  it('should signup a user', async () => {
    const { createdUser, username } = await createNewUser();
    expect(createdUser.username).toEqual(username);
  });

  it('should validate a user', async () => {
    const { username, password, service } = await createNewUser();
    const res = await service.validateUser(username, password);
    expect(res.username).toEqual(username);
  });

  it('should validate a user with invalid password', async () => {
    const { username, service } = await createNewUser();
    const res = await service.validateUser(username, 'invalidPassword');
    expect(res).toBeNull();
  });

  it('should login a user', async () => {
    const { createdUser, service } = await createNewUser();
    const res = await service.createAccessToken(createdUser.username);
    expect(res.accessToken).toBeDefined();
  });
});
