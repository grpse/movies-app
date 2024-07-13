import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { MovieService } from './movie.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthedUser } from '@/auth/user.decorator';
import { AuthedUserModel } from '@/auth/models/authed-user.model';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie, MovieCreated } from './entities/movie';
import { Reaction } from '@prisma/client';
import { fieldListPropsIntoObject } from '@/misc/transform';

const numberQuery = (defaultValue = 100) => ({
  transform: (value: string) => (value ? parseInt(value, 10) : defaultValue),
});

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: MovieCreated,
  })
  @Post()
  create(
    @AuthedUser() user: AuthedUserModel,
    @Body() createMovieDto: CreateMovieDto,
  ) {
    return this.movieService.create({
      ...createMovieDto,
      title: createMovieDto.title,
      userId: user.id,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'The list of movies for the current user',
    type: [Movie],
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of movies to return',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    type: 'number',
    required: false,
    description: 'The number of movies to skip',
    example: 0,
  })
  @ApiQuery({
    name: 'orderBy',
    type: 'string',
    required: false,
    description:
      'The field(s) to order the movies by, separated by commas. Each field can have either asc or desc to specify the order.',
    example: 'createdAt.desc,title.asc',
  })
  @ApiQuery({
    name: 'title',
    type: 'string',
    required: false,
    description: 'The title of the movie filter',
  })
  @Get()
  findAll(
    @AuthedUser() user: AuthedUserModel,
    @Query('limit', numberQuery()) limit = 100,
    @Query('offset', numberQuery(0)) offset = 0,
    @Query('orderBy') orderBy: string = 'createdAt.desc',
    @Query('title') title = '',
  ) {
    return this.movieService.findAll({
      limit,
      offset,
      orderBy: fieldListPropsIntoObject(orderBy),
      title,
      currentUserId: user.id,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Toggle reaction of like to the movie',
  })
  @ApiBadRequestResponse({
    description: 'Movie was not found',
  })
  @ApiParam({
    name: 'movieId',
    type: 'string',
    required: true,
    description: 'The id of the movie',
  })
  @Put(':movieId/toggle/like')
  toggleLikeMovie(
    @AuthedUser() user: AuthedUserModel,
    @Param('movieId') movieId: string,
  ): Promise<void> {
    return this.movieService.toggleMovieReactionFromUser({
      userId: user.id,
      movieId,
      reaction: Reaction.Liked,
    });
  }
}
