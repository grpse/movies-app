import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieModule } from './movie.module';
import { UsersService } from '@/users/users.service';
import { randomString } from 'test/utils/randomString';
import { Reaction } from '@prisma/client';
import { PrismaService } from '@/prisma.service';

describe('movies > MovieService > integration >', () => {
  let service: MovieService;
  let prismaService: PrismaService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
      imports: [MovieModule],
    }).compile();

    service = module.get<MovieService>(MovieService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UsersService>(UsersService);
  });

  const createNewUser = () => {
    const username = randomString();
    const hashedPassword = randomString();
    return userService.create({ username, hashedPassword });
  };

  it('should call find and return create movies by the user', async () => {
    const user = await createNewUser();
    const movieTitle = randomString(10);
    await service.create({
      title: movieTitle,
      userId: user.id,
    });
    const result = await service.findAll({
      currentUserId: user.id,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: movieTitle,
        }),
      ]),
    );
  });

  it('should call create and return a created movie', async () => {
    const user = await createNewUser();
    const movieData = { title: 'Test Movie' };
    const movieCreated = await service.create({
      ...movieData,
      userId: user.id,
    });
    expect(movieCreated).toEqual(expect.objectContaining({ ...movieData }));
  });

  it('should add reaction and fetch it from prisma client', async () => {
    const user = await createNewUser();
    const movieData = { title: 'Test Movie' };
    const createdMovie = await service.create({
      ...movieData,
      userId: user.id,
    });

    await service.toggleMovieReactionFromUser({
      userId: user.id,
      movieId: createdMovie.id,
      reaction: Reaction.Liked,
    });
    // just update the reaction
    await service.toggleMovieReactionFromUser({
      userId: user.id,
      movieId: createdMovie.id,
      reaction: Reaction.Liked,
    });

    const reactionFromPrisma = await prismaService.movieReactions.findFirst({
      where: {
        movieId: createdMovie.id,
        reactedByUserId: user.id,
      },
    });

    const movies = await service.findAll({
      currentUserId: user.id,
      limit: 1,
      offset: 0,
      orderBy: {
        createdAt: 'desc',
      },
    });

    expect(reactionFromPrisma.reaction).toBe(Reaction.Liked);
    expect(movies[0].likes).toBe(1);
  });

  it('should add reactions from different users and sum the reactions', async () => {
    const user1 = await createNewUser();
    const user2 = await createNewUser();
    const movieData = { title: 'Test Movie' };
    const createdMovie = await service.create({
      ...movieData,
      userId: user1.id,
    });

    await service.toggleMovieReactionFromUser({
      userId: user1.id,
      movieId: createdMovie.id,
      reaction: Reaction.Liked,
    });
    await service.toggleMovieReactionFromUser({
      userId: user2.id,
      movieId: createdMovie.id,
      reaction: Reaction.Liked,
    });

    const movies = await service.findAll({
      currentUserId: user1.id,
      limit: 1,
      offset: 0,
      orderBy: {
        createdAt: 'desc',
      },
    });

    expect(movies[0].likes).toBe(2);
  });
});
