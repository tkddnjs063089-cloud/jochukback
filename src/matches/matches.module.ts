import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matches } from './entities/match.entity';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [TypeOrmModule.forFeature([Matches])],
})
export class MatchesModule {}
