import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchRecordDto } from './dto/create-match_record.dto';
import { UpdateMatchRecordDto } from './dto/update-match_record.dto';
import { Repository } from 'typeorm';
import { MatchRecords } from './entities/match_record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDates } from 'src/match-dates/entities/match-date.entity';
import { Players } from 'src/players/entities/player.entity';

@Injectable()
export class MatchRecordsService {
  constructor(
    @InjectRepository(MatchRecords)
    private readonly matchRecordsRepository: Repository<MatchRecords>,
    @InjectRepository(MatchDates)
    private readonly matchDatesRepository: Repository<MatchDates>,
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}
  async create(createMatchRecordDto: CreateMatchRecordDto): Promise<string> {
    const match = await this.matchDatesRepository.findOne({
      where: { id: createMatchRecordDto.matchId },
    });
    if (!match) {
      throw new NotFoundException('해당 경기를 찾을 수 없습니다.');
    }
    const player = await this.playersRepository.findOne({
      where: { id: createMatchRecordDto.playerId },
    });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    const matchRecord = this.matchRecordsRepository.create({
      ...createMatchRecordDto,
      match,
      player,
    });
    await this.matchRecordsRepository.save(matchRecord);
    return `${match.id}번 경기 ${player.id}번 선수의 경기 기록이 생성되었습니다.`;
  }
  async findAll(): Promise<MatchRecords[]> {
    return this.matchRecordsRepository.find();
  }
  async findOne(id: number): Promise<MatchRecords> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    return matchRecord;
  }
  async update(
    id: number,
    updateMatchRecordDto: UpdateMatchRecordDto,
  ): Promise<string> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    await this.matchRecordsRepository.save(
      Object.assign(matchRecord, updateMatchRecordDto),
    );
    return `${matchRecord.matchId}번 경기 ${matchRecord.playerId}번 선수의 경기 기록이 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    await this.matchRecordsRepository.remove(matchRecord);
    return `${matchRecord.matchId}번 경기 ${matchRecord.playerId}번 선수의 경기 기록이 삭제되었습니다.`;
  }
}
