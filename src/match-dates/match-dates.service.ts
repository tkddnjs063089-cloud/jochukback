import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDateDto } from './dto/create-match-date.dto';
import { UpdateMatchDateDto } from './dto/update-match-date.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchDates } from './entities/match-date.entity';

@Injectable()
export class MatchDatesService {
  constructor(
    @InjectRepository(MatchDates)
    private readonly matchDatesRepository: Repository<MatchDates>,
  ) {}
  async create(createMatchDateDto: CreateMatchDateDto): Promise<string> {
    const matchDate = this.matchDatesRepository.create(createMatchDateDto);
    await this.matchDatesRepository.save(matchDate);
    return `${matchDate.eventDate} 경기 날짜가 생성되었습니다.`;
  }
  async findAll(): Promise<MatchDates[]> {
    return this.matchDatesRepository.find();
  }
  async findOne(id: number): Promise<MatchDates> {
    const matchDate = await this.matchDatesRepository.findOne({
      where: { id },
    });
    if (!matchDate) {
      throw new NotFoundException('해당 경기 날짜를 찾을 수 없습니다.');
    }
    return matchDate;
  }
  async update(
    id: number,
    updateMatchDateDto: UpdateMatchDateDto,
  ): Promise<string> {
    const matchDate = await this.matchDatesRepository.findOne({
      where: { id },
    });
    if (!matchDate) {
      throw new NotFoundException('해당 경기 날짜를 찾을 수 없습니다.');
    }
    await this.matchDatesRepository.save(
      Object.assign(matchDate, updateMatchDateDto),
    );
    return `${matchDate.eventDate} 경기 날짜가 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const matchDate = await this.matchDatesRepository.findOne({
      where: { id },
    });
    if (!matchDate) {
      throw new NotFoundException('해당 경기 날짜를 찾을 수 없습니다.');
    }
    await this.matchDatesRepository.remove(matchDate);
    return `${matchDate.eventDate} 경기 날짜가 삭제되었습니다.`;
  }
}
