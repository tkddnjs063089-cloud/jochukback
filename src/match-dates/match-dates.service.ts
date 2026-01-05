import { Injectable } from '@nestjs/common';
import { CreateMatchDateDto } from './dto/create-match-date.dto';
import { UpdateMatchDateDto } from './dto/update-match-date.dto';

@Injectable()
export class MatchDatesService {
  create(createMatchDateDto: CreateMatchDateDto) {
    return 'This action adds a new matchDate';
  }

  findAll() {
    return `This action returns all matchDates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matchDate`;
  }

  update(id: number, updateMatchDateDto: UpdateMatchDateDto) {
    return `This action updates a #${id} matchDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchDate`;
  }
}
