import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchResultService } from './match_result.service';
import { CreateMatchResultDto } from './dto/create-match_result.dto';
import { UpdateMatchResultDto } from './dto/update-match_result.dto';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MatchResults } from './entities/match_result.entity';

@ApiTags('match-results')
@Controller('match-results')
export class MatchResultController {
  constructor(private readonly matchResultService: MatchResultService) {}
  @Post()
  @ApiOperation({
    summary: '경기 결과 등록',
    description: '새로운 경기 결과를 등록합니다.',
  })
  @ApiBody({ type: CreateMatchResultDto })
  @ApiResponse({
    status: 201,
    description: '경기 결과가 성공적으로 등록되었습니다.',
  })
  async create(@Body() createMatchResultDto: CreateMatchResultDto): Promise<{
    message: string;
    id: number;
    result: MatchResults;
  }> {
    return await this.matchResultService.create(createMatchResultDto);
  }
  @Get()
  @ApiOperation({
    summary: '경기 결과 목록 조회',
    description: '경기 결과 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '경기 결과 목록 조회 성공' })
  async findAll(): Promise<MatchResults[]> {
    return await this.matchResultService.findAll();
  }
  @Get(':dateId')
  @ApiOperation({
    summary: 'dateId로 특정 경기 결과 조회',
    description: 'dateId로 특정 경기 결과 목록을 조회합니다.',
  })
  @ApiParam({ name: 'dateId', description: '경기 결과 dateId' })
  @ApiResponse({ status: 200, description: '경기 결과 목록 조회 성공' })
  async findByDateId(@Param('dateId') dateId: string): Promise<MatchResults[]> {
    return await this.matchResultService.findByDateId(dateId);
  }
  @Patch(':dateId')
  @ApiOperation({
    summary: '경기 결과 수정',
    description: 'dateId로 특정 경기 결과를 수정합니다.',
  })
  @ApiBody({ type: UpdateMatchResultDto })
  @ApiResponse({ status: 200, description: '경기 결과 수정 성공' })
  async update(
    @Param('dateId') dateId: string,
    @Body() updateMatchResultDto: UpdateMatchResultDto,
  ): Promise<{
    message: string;
    result: MatchResults;
  }> {
    return await this.matchResultService.update(dateId, updateMatchResultDto);
  }
  @Delete(':id')
  @ApiOperation({
    summary: '경기 결과 삭제',
    description: 'dateId로 특정 경기 결과를 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '경기 결과 삭제 성공' })
  async remove(@Param('id') id: number): Promise<{
    message: string;
    id: number;
  }> {
    return await this.matchResultService.remove(id);
  }
}
