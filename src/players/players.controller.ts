import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Players } from './entities/player.entity';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<string> {
    return await this.playersService.create(createPlayerDto);
  }
  @Get()
  async findAll(): Promise<Players[]> {
    return await this.playersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Players> {
    return await this.playersService.findOne(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<string> {
    return await this.playersService.update(id, updatePlayerDto);
  }
  @Delete(':name')
  async remove(@Param('name') name: string): Promise<string> {
    return await this.playersService.remove(name);
  }
}
