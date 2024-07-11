import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
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
import { MovieEntity } from './entities/movie';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Reaction } from '@prisma/client';

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
    type: MovieEntity,
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
    type: [MovieEntity],
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
  @Get()
  findAll(
    @Query('limit', numberQuery()) limit = 100,
    @Query('offset', numberQuery(0)) offset = 0,
  ) {
    return this.movieService.findAll({
      limit,
      offset,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Updated movie',
    type: MovieEntity,
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
  @Patch(':movieId')
  update(
    @AuthedUser() user: AuthedUserModel,
    @Param('movieId') movieId: string,
    @Body() updateMovieData: UpdateMovieDto,
  ) {
    return this.movieService.update({
      userId: user.id,
      movieId,
      ...updateMovieData,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Added reaction of like to the movie',
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
  @Post(':movieId/like')
  likeMovie(
    @AuthedUser() user: AuthedUserModel,
    @Param('movieId') movieId: string,
  ): Promise<void> {
    return this.movieService.addMovieReactionFromUser({
      userId: user.id,
      movieId,
      reaction: Reaction.Liked,
    });
  }
}
