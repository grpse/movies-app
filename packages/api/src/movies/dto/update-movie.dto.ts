import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
  })
  @IsString()
  title: string;
}
