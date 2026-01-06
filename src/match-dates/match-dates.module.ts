import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchDatesService } from './match-dates.service';
import { MatchDatesController } from './match-dates.controller';
import { MatchDates } from './entities/match-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchDates])],
  controllers: [MatchDatesController],
  providers: [MatchDatesService],
})
export class MatchDatesModule {}
