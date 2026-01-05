import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Repository } from 'typeorm';
import { Matches } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Matches)
    private readonly matchesRepository: Repository<Matches>,
  ) {}
  async create(createMatchDto: CreateMatchDto): Promise<Matches> {
    const match = this.matchesRepository.create(createMatchDto);
    return this.matchesRepository.save(match);
  }
  async findAll(): Promise<Matches[]> {
    return this.matchesRepository.find();
  }
  async findOne(id: number): Promise<Matches> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    return match;
  }
  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Matches> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    return this.matchesRepository.save(Object.assign(match, updateMatchDto));
  }
  async remove(id: number): Promise<void> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    await this.matchesRepository.remove(match);
  }
}
