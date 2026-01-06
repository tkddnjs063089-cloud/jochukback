import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Teams } from './entities/team.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @Post()
  @ApiOperation({ summary: '팀 등록', description: '새로운 팀을 등록합니다.' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: '팀이 성공적으로 등록되었습니다.' })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<string> {
    return await this.teamsService.create(createTeamDto);
  }
  @Get()
  @ApiOperation({
    summary: '전체 팀 조회',
    description: '모든 팀 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '팀 목록 조회 성공' })
  async findAll(): Promise<Teams[]> {
    return await this.teamsService.findAll();
  }
  @Get(':id')
  @ApiOperation({
    summary: '팀 상세 조회',
    description: 'ID로 특정 팀을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '팀 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 조회 성공' })
  async findOne(@Param('id') id: number): Promise<Teams> {
    return await this.teamsService.findOne(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: '팀 수정', description: '특정 팀을 수정합니다.' })
  @ApiParam({ name: 'id', description: '팀 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 수정 성공' })
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<string> {
    return await this.teamsService.update(id, updateTeamDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: '팀 삭제', description: '특정 팀을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '팀 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 삭제 성공' })
  async remove(@Param('id') id: number): Promise<string> {
    return await this.teamsService.remove(id);
  }
}
