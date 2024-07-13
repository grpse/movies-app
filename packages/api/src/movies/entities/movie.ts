import { ApiProperty } from '@nestjs/swagger';
import { Movie as PrismaMovie } from '@prisma/client';

export class Movie {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  meLiked: boolean;
}

export class MovieCreated implements Omit<PrismaMovie, 'addedByUserId'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;
}
