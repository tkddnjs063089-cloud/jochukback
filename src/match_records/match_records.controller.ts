import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { MatchRecordsService } from './match_records.service';
import { CreateMatchRecordDto } from './dto/create-match_record.dto';
import { UpdateMatchRecordDto } from './dto/update-match_record.dto';
import { MatchRecords } from './entities/match_record.entity';

@ApiTags('match-records')
@Controller(['match-records', 'player-records'])
export class MatchRecordsController {
  constructor(private readonly matchRecordsService: MatchRecordsService) {}
  @Post()
  @ApiOperation({
    summary: '경기 기록 생성',
    description: '새로운 경기 기록을 생성합니다.',
  })
  @ApiBody({
    type: CreateMatchRecordDto,
    examples: {
      홍길동: {
        value: {
          playerId: 1,
          teamId: 1,
          attendance: true,
          late: false,
          goals: 0,
          assists: 0,
          cleanSheet: 0,
          mom: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          dateId: '2026-01-01',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '경기 기록 생성 성공' })
  async create(
    @Body() createMatchRecordDto: CreateMatchRecordDto,
  ): Promise<{ message: string; id: number; record: MatchRecords }> {
    return await this.matchRecordsService.create(createMatchRecordDto);
  }
  @Get()
  @ApiOperation({
    summary: '전체 경기 기록 조회',
    description: '모든 경기 기록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '경기 기록 목록 조회 성공' })
  async findAll(): Promise<MatchRecords[]> {
    return await this.matchRecordsService.findAll();
  }
  @Patch(':id')
  @ApiOperation({
    summary: '경기 기록 수정',
    description: 'ID로 특정 경기 기록을 수정합니다.',
  })
  @ApiBody({
    type: UpdateMatchRecordDto,
    examples: {
      홍길동: {
        value: {
          playerId: 1,
          teamId: 1,
          attendance: true,
          late: false,
          goals: 0,
          assists: 0,
          cleanSheet: 0,
          mom: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          dateId: '2026-01-01',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '경기 기록 수정 성공' })
  async update(
    @Param('id') id: number,
    @Body() updateMatchRecordDto: UpdateMatchRecordDto,
  ): Promise<{ message: string; record: MatchRecords }> {
    return await this.matchRecordsService.update(id, updateMatchRecordDto);
  }
  @Delete(':id')
  @ApiOperation({
    summary: '경기 기록 삭제',
    description: 'ID로 특정 경기 기록을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '경기 기록 ID', example: 1 })
  @ApiResponse({ status: 200, description: '경기 기록 삭제 성공' })
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; id: number }> {
    return await this.matchRecordsService.remove(id);
  }
}
