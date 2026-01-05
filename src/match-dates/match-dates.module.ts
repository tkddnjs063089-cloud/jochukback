import { Module } from '@nestjs/common';
import { MatchDatesService } from './match-dates.service';
import { MatchDatesController } from './match-dates.controller';

@Module({
  controllers: [MatchDatesController],
  providers: [MatchDatesService],
})
export class MatchDatesModule {}
