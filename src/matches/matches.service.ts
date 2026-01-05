import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async create(createMatchDto: CreateMatchDto): Promise<string> {
    const match = this.matchesRepository.create(createMatchDto);
    if (
      await this.matchesRepository.findOne({
        where: {
          matchDate: createMatchDto.matchDate,
          matchOrder: createMatchDto.matchOrder,
          teamType: createMatchDto.teamType,
        },
      })
    ) {
      throw new BadRequestException(
        `${createMatchDto.matchDate}일 ${createMatchDto.matchOrder}번째 경기 ${createMatchDto.teamType}팀 경기는 이미 존재합니다.`,
      );
    }
    await this.matchesRepository.save(match);
    return `${createMatchDto.matchDate}일 ${createMatchDto.matchOrder}번째 경기 ${createMatchDto.teamType}팀 경기가 생성되었습니다.`;
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
  async findByDate(matchDate: string): Promise<Matches[]> {
    const matches = await this.matchesRepository.find({
      where: { matchDate },
      order: { matchOrder: 'ASC' },
    });
    if (matches.length === 0) {
      throw new NotFoundException('해당 날짜의 경기를 찾을 수 없습니다.');
    }
    return matches;
  }
  async findByDateAndOrder(
    matchDate: string,
    matchOrder: number,
    teamType: 'PINK' | 'BLACK',
  ): Promise<Matches> {
    const match = await this.matchesRepository.findOne({
      where: { matchDate, matchOrder, teamType: teamType as 'PINK' | 'BLACK' },
    });

    if (!match) {
      throw new NotFoundException(
        `${matchDate} ${matchOrder}경기 ${teamType}팀을 찾을 수 없습니다.`,
      );
    }
    return match;
  }
  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<string> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    if (
      await this.matchesRepository.findOne({
        where: {
          matchDate: updateMatchDto.matchDate,
          matchOrder: updateMatchDto.matchOrder,
          teamType: updateMatchDto.teamType,
        },
      })
    ) {
      throw new BadRequestException(
        '해당 경기가 이미 존재하므로 수정할 수 없습니다.',
      );
    }
    await this.matchesRepository.save(Object.assign(match, updateMatchDto));
    return `${match.matchDate}일 ${match.matchOrder}번째 경기 ${match.teamType}팀 경기가 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    await this.matchesRepository.remove(match);
    return `${match.matchDate}일 ${match.matchOrder}번째 경기 ${match.teamType}팀 경기가 삭제되었습니다.`;
  }
}
