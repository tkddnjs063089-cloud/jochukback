import { Module } from '@nestjs/common';
import { MatchRecordsService } from './match_records.service';
import { MatchRecordsController } from './match_records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRecords } from './entities/match_record.entity';

@Module({
  controllers: [MatchRecordsController],
  providers: [MatchRecordsService],
  imports: [TypeOrmModule.forFeature([MatchRecords])],
})
export class MatchRecordsModule {}
