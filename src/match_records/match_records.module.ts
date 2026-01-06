import { Module } from '@nestjs/common';
import { MatchRecordsService } from './match_records.service';
import { MatchRecordsController } from './match_records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRecords } from './entities/match_record.entity';
import { MatchDates } from 'src/match-dates/entities/match-date.entity';
import { Players } from 'src/players/entities/player.entity';

@Module({
  controllers: [MatchRecordsController],
  providers: [MatchRecordsService],
  imports: [TypeOrmModule.forFeature([MatchRecords, MatchDates, Players])],
})
export class MatchRecordsModule {}
