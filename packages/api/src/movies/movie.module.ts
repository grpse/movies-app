import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { DbModule } from '@/db.module';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [DbModule],
})
export class MovieModule {}
