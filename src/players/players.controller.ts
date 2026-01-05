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
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Players> {
    return this.playersService.create(createPlayerDto);
  }
  @Get()
  findAll(): Promise<Players[]> {
    return this.playersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Players> {
    return this.playersService.findOne(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Players> {
    return this.playersService.update(id, updatePlayerDto);
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.playersService.remove(id);
  }
}
