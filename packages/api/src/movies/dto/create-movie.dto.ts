import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
