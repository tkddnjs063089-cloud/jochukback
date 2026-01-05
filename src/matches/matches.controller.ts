import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Matches } from './entities/match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto): Promise<string> {
    return await this.matchesService.create(createMatchDto);
  }
  @Get()
  async findAll(): Promise<Matches[]> {
    return await this.matchesService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Matches> {
    return await this.matchesService.findOne(id);
  }
  @Get('date/:matchDate')
  async findByDate(@Param('matchDate') matchDate: string): Promise<Matches[]> {
    return await this.matchesService.findByDate(matchDate);
  }
  @Get('date/:matchDate/order/:matchOrder/team/:teamType')
  async findByDateAndOrder(
    @Param('matchDate') matchDate: string,
    @Param('matchOrder') matchOrder: number,
    @Param('teamType') teamType: 'PINK' | 'BLACK',
  ): Promise<Matches> {
    return await this.matchesService.findByDateAndOrder(
      matchDate,
      matchOrder,
      teamType as 'PINK' | 'BLACK',
    );
  }
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<string> {
    return await this.matchesService.update(id, updateMatchDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    return await this.matchesService.remove(id);
  }
}
