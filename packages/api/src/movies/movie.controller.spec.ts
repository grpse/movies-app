import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieModule } from './movie.module';
import { DbModule } from '@/db.module';
import { UsersService } from '@/users/users.service';
import { randomString } from 'test/utils/randomString';

describe('movies > MovieController > integration >', () => {
  let controller: MovieController;
  let usersService: UsersService;
  let moviesService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [MovieModule, DbModule],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    usersService = module.get<UsersService>(UsersService);
    moviesService = module.get<MovieService>(MovieService);
  });

  const createNewUser = () => {
    const username = randomString();
    const hashedPassword = randomString();
    return usersService.create({ username, hashedPassword });
  };

  it('should create a movie for the logged in user', async () => {
    const user = await createNewUser();
    const createMovieDto = {
      title: 'Test Title',
      description: 'Test Description',
    };
    const movieEntity = await controller.create(
      {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      createMovieDto,
    );

    expect(movieEntity).toEqual(expect.objectContaining(createMovieDto));
  });

  it('should all movies', async () => {
    const user = await createNewUser();
    const createMovieDto = {
      title: 'Test Title',
      description: 'Test Description',
    };
    await moviesService.create({
      ...createMovieDto,
      userId: user.id,
    });

    const usermovies = await controller.findAll(user);

    expect(usermovies).toEqual(
      expect.arrayContaining([expect.objectContaining(createMovieDto)]),
    );
  });
});
