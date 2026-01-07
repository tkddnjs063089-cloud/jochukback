import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Players } from './entities/player.entity';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({
    summary: '선수 등록',
    description: '새로운 선수를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '선수가 성공적으로 등록되었습니다.',
  })
  async create(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<{ message: string }> {
    return await this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 선수 조회',
    description: '모든 선수 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '선수 목록 조회 성공' })
  async findAll(): Promise<Players[]> {
    return await this.playersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '선수 상세 조회',
    description: 'ID로 특정 선수를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '선수 ID', example: 1 })
  @ApiResponse({ status: 200, description: '선수 조회 성공' })
  async findOne(@Param('id') id: number): Promise<Players> {
    return await this.playersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '선수 정보 수정',
    description: '선수 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '선수 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '선수 정보가 성공적으로 수정되었습니다.',
  })
  async update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<string> {
    return await this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '선수 삭제',
    description: '이름으로 선수를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '선수 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '선수가 성공적으로 삭제되었습니다.',
  })
  async remove(@Param('id') id: number): Promise<string> {
    return await this.playersService.remove(id);
  }
}
