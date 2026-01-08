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
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Matches } from './entities/match.entity';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({
    summary: '경기 등록',
    description: '새로운 경기를 등록합니다.',
  })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({
    status: 201,
    description: '경기가 성공적으로 등록되었습니다.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        id: { type: 'number' },
        matchDate: { type: 'string' },
        matchOrder: { type: 'number' },
        teamId: { type: 'number', nullable: true },
      },
    },
  })
  async create(@Body() createMatchDto: CreateMatchDto): Promise<{
    message: string;
    id: number;
    matchDate: string;
    matchOrder: number;
    teamId?: number;
  }> {
    return await this.matchesService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 경기 조회',
    description: '모든 경기 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '경기 목록 조회 성공' })
  async findAll(): Promise<Matches[]> {
    return await this.matchesService.findAll();
  }

  @Get(':matchDate')
  @ApiOperation({
    summary: 'matchDate로 특정 경기 조회',
    description: 'matchDate로 특정 경기를 조회합니다.',
  })
  @ApiParam({
    name: 'matchDate',
    description: '경기 matchDate',
    example: '2026-01-05',
  })
  @ApiResponse({ status: 200, description: '경기 조회 성공' })
  async findByDateId(
    @Param('matchDate') matchDate: string,
  ): Promise<Matches[]> {
    return await this.matchesService.findByDateId(matchDate);
  }

  @Get('date/:matchDate')
  @ApiOperation({
    summary: '날짜별 경기 조회',
    description: '특정 날짜의 모든 경기를 조회합니다.',
  })
  @ApiParam({
    name: 'matchDate',
    description: '경기 날짜 (YYYY-MM-DD)',
    example: '2026-01-05',
  })
  @ApiResponse({ status: 200, description: '경기 목록 조회 성공' })
  async findByDate(@Param('matchDate') matchDate: string): Promise<Matches[]> {
    return await this.matchesService.findByDate(matchDate);
  }

  @Get('date/:matchDate/order/:matchOrder')
  @ApiOperation({
    summary: '날짜/순서/팀별 경기 조회',
    description: '특정 날짜, 순서, 팀 타입으로 경기를 조회합니다.',
  })
  @ApiParam({
    name: 'matchDate',
    description: '경기 날짜',
    example: '2026-01-05',
  })
  @ApiParam({ name: 'matchOrder', description: '경기 순서', example: 1 })
  @ApiResponse({ status: 200, description: '경기 조회 성공' })
  async findByDateAndOrder(
    @Param('matchDate') matchDate: string,
    @Param('matchOrder') matchOrder: number,
  ): Promise<Matches> {
    return await this.matchesService.findByDateAndOrder(matchDate, matchOrder);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateMatchDto,
    examples: {
      '2026-01-05': { value: { matchDate: '2026-01-05', matchOrder: 1 } },
    },
  })
  @ApiOperation({
    summary: '경기 정보 수정',
    description: '경기 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '경기 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '경기 정보가 성공적으로 수정되었습니다.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<{ message: string; match: Matches }> {
    return await this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '경기 삭제', description: '경기를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '경기 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '경기가 성공적으로 삭제되었습니다.',
  })
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; id: number }> {
    return await this.matchesService.remove(id);
  }
}
