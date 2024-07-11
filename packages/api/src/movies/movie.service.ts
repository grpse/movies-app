import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Movie, Reaction } from '@prisma/client';

interface CreateMovieParams {
  title: string;
  userId: string;
}

interface UpdateMovieParams {
  userId: string;
  movieId: string;
  title?: string;
}

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  create(createMovieDto: CreateMovieParams) {
    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        addedByUser: {
          connect: {
            id: createMovieDto.userId,
          },
        },
      },
    });
  }

  findAll({
    limit = 100,
    offset = 0,
    orderBy = {},
    title = '',
  }: {
    limit?: number;
    offset?: number;
    orderBy?: { [K in keyof Movie]?: 'desc' | 'asc' };
    title?: string;
  }) {
    return this.prisma.movie.findMany({
      take: limit,
      skip: offset,
      orderBy,
      where: {
        title: {
          mode: 'insensitive',
          contains: title,
        },
      },
      include: {
        _count: {
          select: {
            reactions: {
              where: {
                reaction: Reaction.Liked,
              },
            },
          },
        },
      },
    });
  }

  async update({ userId, movieId, title }: UpdateMovieParams) {
    const movie = await this.prisma.movie.update({
      where: { id: movieId, addedByUserId: userId },
      data: {
        title,
      },
    });

    if (!movie) {
      throw new BadRequestException(`Movie with id ${movieId} not found`);
    }

    return movie;
  }

  async addMovieReactionFromUser({
    userId,
    movieId,
    reaction,
  }: {
    userId: string;
    movieId: string;
    reaction: Reaction;
  }) {
    const existingReaction = await this.prisma.movieReactions.findFirst({
      where: {
        movieId,
        reactedByUserId: userId,
      },
    });

    if (existingReaction) {
      await this.prisma.movieReactions.update({
        where: { id: existingReaction.id },
        data: { reaction },
      });
    } else {
      await this.prisma.movieReactions.create({
        data: {
          movie: { connect: { id: movieId } },
          reactedByUser: { connect: { id: userId } },
          reaction,
        },
      });
    }
  }
}
