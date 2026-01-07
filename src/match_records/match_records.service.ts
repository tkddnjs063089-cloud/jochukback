import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchRecordDto } from './dto/create-match_record.dto';
import { UpdateMatchRecordDto } from './dto/update-match_record.dto';
import { Repository } from 'typeorm';
import { MatchRecords } from './entities/match_record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Players } from 'src/players/entities/player.entity';
import { Teams } from 'src/teams/entities/team.entity';

@Injectable()
export class MatchRecordsService {
  constructor(
    @InjectRepository(MatchRecords)
    private readonly matchRecordsRepository: Repository<MatchRecords>,
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}
  async create(createMatchRecordDto: CreateMatchRecordDto): Promise<{
    message: string;
    id: number;
    record: MatchRecords;
  }> {
    const player = await this.playersRepository.findOne({
      where: { id: createMatchRecordDto.playerId },
    });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }

    // teamId가 있으면 팀 조회
    let team: Teams | undefined = undefined;
    if (createMatchRecordDto.teamId) {
      const foundTeam = await this.teamsRepository.findOne({
        where: { id: createMatchRecordDto.teamId },
      });
      if (foundTeam) {
        team = foundTeam;
      }
    }

    // 프론트 호환: goal → goals, assist → assists 매핑
    const goals = createMatchRecordDto.goal ?? createMatchRecordDto.goals ?? 0;
    const assists =
      createMatchRecordDto.assist ?? createMatchRecordDto.assists ?? 0;

    // 엔티티에 맞는 필드만 사용
    const matchRecord = this.matchRecordsRepository.create({
      playerId: createMatchRecordDto.playerId,
      teamId: createMatchRecordDto.teamId ?? null,
      dateId: createMatchRecordDto.dateId ?? null,
      attendance: createMatchRecordDto.attendance ?? false,
      goals,
      assists,
      cleanSheet: createMatchRecordDto.cleanSheet ?? 0,
      mom: createMatchRecordDto.mom ?? false,
      wins: createMatchRecordDto.wins ?? 0,
      draws: createMatchRecordDto.draws ?? 0,
      losses: createMatchRecordDto.losses ?? 0,
      player,
      team,
    });
    await this.matchRecordsRepository.save(matchRecord);
    return {
      message: `${player.name} 선수의 경기 기록이 생성되었습니다.`,
      id: matchRecord.id,
      record: matchRecord,
    };
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
    return `${matchRecord.player.name} 선수의 경기 기록이 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    await this.matchRecordsRepository.remove(matchRecord);
    return `${matchRecord.player.name} 선수의 경기 기록이 삭제되었습니다.`;
  }
}
