import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MatchDatesService } from './match-dates.service';
import { CreateMatchDateDto } from './dto/create-match-date.dto';
import { UpdateMatchDateDto } from './dto/update-match-date.dto';

@ApiTags('match-dates')
@Controller('match-dates')
export class MatchDatesController {
  constructor(private readonly matchDatesService: MatchDatesService) {}

  @Post()
  @ApiOperation({ summary: '경기 일정 등록', description: '새로운 경기 일정을 등록합니다.' })
  @ApiResponse({ status: 201, description: '경기 일정이 성공적으로 등록되었습니다.' })
  create(@Body() createMatchDateDto: CreateMatchDateDto) {
    return this.matchDatesService.create(createMatchDateDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 경기 일정 조회', description: '모든 경기 일정을 조회합니다.' })
  @ApiResponse({ status: 200, description: '경기 일정 목록 조회 성공' })
  findAll() {
    return this.matchDatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '경기 일정 상세 조회', description: 'ID로 특정 경기 일정을 조회합니다.' })
  @ApiParam({ name: 'id', description: '경기 일정 ID', example: 1 })
  @ApiResponse({ status: 200, description: '경기 일정 조회 성공' })
  findOne(@Param('id') id: string) {
    return this.matchDatesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '경기 일정 수정', description: '경기 일정 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '경기 일정 ID', example: 1 })
  @ApiResponse({ status: 200, description: '경기 일정이 성공적으로 수정되었습니다.' })
  update(@Param('id') id: string, @Body() updateMatchDateDto: UpdateMatchDateDto) {
    return this.matchDatesService.update(+id, updateMatchDateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '경기 일정 삭제', description: '경기 일정을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '경기 일정 ID', example: 1 })
  @ApiResponse({ status: 200, description: '경기 일정이 성공적으로 삭제되었습니다.' })
  remove(@Param('id') id: string) {
    return this.matchDatesService.remove(+id);
  }
}
