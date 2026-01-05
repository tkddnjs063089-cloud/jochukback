import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchRecordsService } from './match_records.service';
import { CreateMatchRecordDto } from './dto/create-match_record.dto';
import { UpdateMatchRecordDto } from './dto/update-match_record.dto';

@Controller('match-records')
export class MatchRecordsController {
  constructor(private readonly matchRecordsService: MatchRecordsService) {}
}
