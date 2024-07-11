import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { randomString } from 'test/utils/randomString';

describe('users > UsersService > integration >', () => {
  const getUsersService = async (): Promise<UsersService> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    return module.get<UsersService>(UsersService);
  };

  describe('findOne', () => {
    it('should find user if it exists', async () => {
      const user = { username: randomString(), hashedPassword: randomString() };
      const service = await getUsersService();
      await service.create(user);
      const result = await service.findOne(user.username);
      expect(result).toEqual({
        id: expect.any(String),
        username: user.username,
        password: user.hashedPassword,
      });
    });

    it('should throw error if user does not exists', async () => {
      const user = { username: randomString() };
      const service = await getUsersService();
      expect(await service.findOne(user.username)).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user if data is valid', async () => {
      const user = { username: randomString(), hashedPassword: randomString() };
      const service = await getUsersService();
      const result = await service.create(user);
      expect(result).toEqual(
        expect.objectContaining({
          username: user.username,
          id: expect.any(String),
        }),
      );
    });

    it('should throw error if data is incorrect', async () => {
      const user = { username: '', hashedPassword: '' };
      const service = await getUsersService();
      await expect(service.create(user)).rejects.toThrow();
    });
  });
});
