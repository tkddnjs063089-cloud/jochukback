import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamPlayersService } from './team-players.service';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TeamPlayers } from './entities/team-player.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('team-players')
@Controller('team-players')
export class TeamPlayersController {
  constructor(private readonly teamPlayersService: TeamPlayersService) {}

  @Post()
  @ApiOperation({
    summary: '팀 선수 등록',
    description: '새로운 팀 선수를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '팀 선수가 성공적으로 등록되었습니다.',
  })
  async create(
    @Body() createTeamPlayerDto: CreateTeamPlayerDto,
  ): Promise<string> {
    return await this.teamPlayersService.create(createTeamPlayerDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 팀 선수 조회',
    description: '모든 팀 선수 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '팀 선수 목록 조회 성공' })
  async findAll(): Promise<TeamPlayers[]> {
    return await this.teamPlayersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '팀 선수 상세 조회',
    description: 'ID로 특정 팀 선수를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '팀 선수 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 선수 조회 성공' })
  async findOne(@Param('id') id: number): Promise<TeamPlayers> {
    return await this.teamPlayersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '팀 선수 수정',
    description: '특정 팀 선수를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '팀 선수 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 선수 수정 성공' })
  async update(
    @Param('id') id: number,
    @Body() updateTeamPlayerDto: UpdateTeamPlayerDto,
  ): Promise<string> {
    return await this.teamPlayersService.update(id, updateTeamPlayerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '팀 선수 삭제',
    description: '특정 팀 선수를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '팀 선수 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀 선수 삭제 성공' })
  async remove(@Param('id') id: number): Promise<string> {
    return await this.teamPlayersService.remove(id);
  }
}
