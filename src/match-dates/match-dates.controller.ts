import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchDatesService } from './match-dates.service';
import { CreateMatchDateDto } from './dto/create-match-date.dto';
import { UpdateMatchDateDto } from './dto/update-match-date.dto';

@Controller('match-dates')
export class MatchDatesController {
  constructor(private readonly matchDatesService: MatchDatesService) {}

  @Post()
  create(@Body() createMatchDateDto: CreateMatchDateDto) {
    return this.matchDatesService.create(createMatchDateDto);
  }

  @Get()
  findAll() {
    return this.matchDatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchDatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDateDto: UpdateMatchDateDto) {
    return this.matchDatesService.update(+id, updateMatchDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchDatesService.remove(+id);
  }
}
