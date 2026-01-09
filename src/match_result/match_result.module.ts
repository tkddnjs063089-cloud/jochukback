import { Module } from '@nestjs/common';
import { MatchResultService } from './match_result.service';
import { MatchResultController } from './match_result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchResults } from './entities/match_result.entity';

@Module({
  controllers: [MatchResultController],
  providers: [MatchResultService],
  imports: [TypeOrmModule.forFeature([MatchResults])],
})
export class MatchResultModule {}
