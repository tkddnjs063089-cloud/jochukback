import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TeamPlayersService } from './team-players.service';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { TeamPlayers } from './entities/team-player.entity';

@ApiTags('team-players')
@Controller('team-players')
export class TeamPlayersController {
  constructor(private readonly teamPlayersService: TeamPlayersService) {}

  @Post()
  @ApiBody({
    type: CreateTeamPlayerDto,
    examples: {
      홍길동: { value: { teamId: 1, playerId: 1 } },
    },
  })
  @ApiOperation({
    summary: '팀-선수 관계 생성',
    description: '선수를 팀에 추가합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '선수가 팀에 성공적으로 추가되었습니다.',
  })
  async create(@Body() createTeamPlayerDto: CreateTeamPlayerDto): Promise<{
    message: string;
    id: number;
    teamPlayer: TeamPlayers;
  }> {
    return await this.teamPlayersService.create(createTeamPlayerDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 팀-선수 관계 조회',
    description: '모든 팀-선수 관계를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '팀-선수 관계 목록 조회 성공' })
  async findAll(): Promise<TeamPlayers[]> {
    return await this.teamPlayersService.findAll();
  }

  @Get('team/:teamId')
  @ApiOperation({
    summary: '팀별 선수 조회',
    description: '특정 팀에 속한 모든 선수를 조회합니다.',
  })
  @ApiParam({ name: 'teamId', description: '팀 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀별 선수 조회 성공' })
  async findByTeam(@Param('teamId') teamId: number): Promise<TeamPlayers[]> {
    return await this.teamPlayersService.findByTeam(teamId);
  }

  @Get('player/:playerId')
  @ApiOperation({
    summary: '선수별 팀 조회',
    description: '특정 선수가 속한 모든 팀을 조회합니다.',
  })
  @ApiParam({ name: 'playerId', description: '선수 ID', example: 1 })
  @ApiResponse({ status: 200, description: '선수별 팀 조회 성공' })
  async findByPlayer(
    @Param('playerId') playerId: number,
  ): Promise<TeamPlayers[]> {
    return await this.teamPlayersService.findByPlayer(playerId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '팀-선수 관계 상세 조회',
    description: 'ID로 특정 팀-선수 관계를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '팀-선수 관계 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀-선수 관계 조회 성공' })
  async findOne(@Param('id') id: number): Promise<TeamPlayers> {
    return await this.teamPlayersService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateTeamPlayerDto,
    examples: {
      홍길동: { value: { teamId: 1, playerId: 1 } },
    },
  })
  @ApiOperation({
    summary: '팀-선수 관계 수정',
    description: '특정 팀-선수 관계를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '팀-선수 관계 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀-선수 관계 수정 성공' })
  async update(
    @Param('id') id: number,
    @Body() updateTeamPlayerDto: UpdateTeamPlayerDto,
  ): Promise<{ message: string; teamPlayer: TeamPlayers }> {
    return await this.teamPlayersService.update(id, updateTeamPlayerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '팀-선수 관계 삭제',
    description: '특정 팀-선수 관계를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '팀-선수 관계 ID', example: 1 })
  @ApiResponse({ status: 200, description: '팀-선수 관계 삭제 성공' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return await this.teamPlayersService.remove(id);
  }
}
