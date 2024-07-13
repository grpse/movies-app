import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Movie as PrismaMovie, Reaction } from '@prisma/client';
import { Movie } from './entities/movie';

interface CreateMovieParams {
  title: string;
  userId: string;
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

  async findAll({
    limit = 100,
    offset = 0,
    orderBy = {},
    title = '',
    currentUserId,
  }: {
    limit?: number;
    offset?: number;
    orderBy?: { [K in keyof PrismaMovie]?: 'desc' | 'asc' };
    title?: string;
    currentUserId: string;
  }) {
    const movies = await this.prisma.movie.findMany({
      where: {
        title: {
          mode: 'insensitive',
          contains: title,
        },
      },
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            reactions: true,
          },
        },
        reactions: {
          where: {
            reactedByUserId: currentUserId,
          },
        },
      },
    });

    return movies.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        createdAt: movie.createdAt,
        meLiked: movie.reactions.some(
          (reaction) => reaction.reactedByUserId === currentUserId,
        ),
        likes: movie._count.reactions,
      } as Movie;
    });
  }

  async toggleMovieReactionFromUser({
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
      await this.prisma.movieReactions.deleteMany({
        where: { id: existingReaction.id },
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

  async removeMovieReactionFromUser({
    userId,
    movieId,
  }: {
    userId: string;
    movieId: string;
  }) {
    await this.prisma.movieReactions.deleteMany({
      where: {
        movieId,
        reactedByUserId: userId,
      },
    });
  }
}
