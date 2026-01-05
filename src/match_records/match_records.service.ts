import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchRecordDto } from './dto/create-match_record.dto';
import { UpdateMatchRecordDto } from './dto/update-match_record.dto';
import { Repository } from 'typeorm';
import { MatchRecords } from './entities/match_record.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatchRecordsService {
  constructor(
    @InjectRepository(MatchRecords)
    private readonly matchRecordsRepository: Repository<MatchRecords>,
  ) {}
  async create(
    createMatchRecordDto: CreateMatchRecordDto,
  ): Promise<MatchRecords> {
    const matchRecord =
      this.matchRecordsRepository.create(createMatchRecordDto);
    return this.matchRecordsRepository.save(matchRecord);
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
  ): Promise<MatchRecords> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    return this.matchRecordsRepository.save(
      Object.assign(matchRecord, updateMatchRecordDto),
    );
  }
  async remove(id: number): Promise<void> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    await this.matchRecordsRepository.remove(matchRecord);
  }
}
