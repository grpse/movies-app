import { ApiProperty } from '@nestjs/swagger';
import { Movie, MovieReactions } from '@prisma/client';

export class MovieEntity implements Omit<Movie, 'addedByUserId'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  reactions: Array<MovieReactions>;

  @ApiProperty()
  createdAt: Date;
}
