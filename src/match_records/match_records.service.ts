import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      // 로그 추가 (디버깅용)
      console.log('[MatchRecordsService] 받은 데이터:', createMatchRecordDto);

      const player = await this.playersRepository.findOne({
        where: { id: createMatchRecordDto.playerId },
      });
      if (!player) {
        throw new NotFoundException(
          `playerId ${createMatchRecordDto.playerId}인 선수를 찾을 수 없습니다.`,
        );
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
      const goals =
        createMatchRecordDto.goal ?? createMatchRecordDto.goals ?? 0;
      const assists =
        createMatchRecordDto.assist ?? createMatchRecordDto.assists ?? 0;

      // dateId 변환: 숫자(ms timestamp)면 ISO string으로 변환
      let dateIdValue: string | null = null;
      if (createMatchRecordDto.dateId != null) {
        if (typeof createMatchRecordDto.dateId === 'number') {
          // ms timestamp → ISO string
          dateIdValue = new Date(createMatchRecordDto.dateId).toISOString();
        } else {
          // 이미 string이면 그대로 사용
          dateIdValue = createMatchRecordDto.dateId;
        }
      }

      // 엔티티에 맞는 필드만 사용
      const matchRecord = this.matchRecordsRepository.create({
        playerId: createMatchRecordDto.playerId,
        teamId: createMatchRecordDto.teamId ?? null,
        dateId: dateIdValue,
        attendance: createMatchRecordDto.attendance ?? false,
        late: createMatchRecordDto.late ?? false,
        goals,
        assists,
        cleanSheet: createMatchRecordDto.cleanSheet ?? 0,
        mom: createMatchRecordDto.mom ?? 0,
        wins: createMatchRecordDto.wins ?? 0,
        draws: createMatchRecordDto.draws ?? 0,
        losses: createMatchRecordDto.losses ?? 0,
        player,
        team,
      });

      console.log('[MatchRecordsService] 저장할 데이터:', matchRecord);

      await this.matchRecordsRepository.save(matchRecord);
      return {
        message: `${player.name} 선수의 경기 기록이 생성되었습니다.`,
        id: matchRecord.id,
        record: matchRecord,
      };
    } catch (error) {
      console.error('[MatchRecordsService] 에러 발생:', error);

      // Unique constraint 에러
      if (error.code === '23505') {
        throw new BadRequestException(
          '이미 동일한 선수/날짜 조합의 기록이 존재합니다.',
        );
      }

      // Foreign key constraint 에러
      if (error.code === '23503') {
        throw new BadRequestException(
          '존재하지 않는 팀, 선수 또는 날짜 ID입니다.',
        );
      }

      // 컬럼 없음 에러
      if (error.message?.includes('column')) {
        throw new InternalServerErrorException(
          `DB 컬럼 에러: ${error.message}`,
        );
      }

      // 기타 에러
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `경기 기록 생성 중 오류 발생: ${error.message}`,
      );
    }
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
  ): Promise<{ message: string; record: MatchRecords }> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    await this.matchRecordsRepository.save(
      Object.assign(matchRecord, updateMatchRecordDto),
    );
    return {
      message: `${matchRecord.player?.name ?? id} 선수의 경기 기록이 수정되었습니다.`,
      record: matchRecord,
    };
  }
  async remove(id: number): Promise<{ message: string; id: number }> {
    const matchRecord = await this.matchRecordsRepository.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!matchRecord) {
      throw new NotFoundException('해당 경기 기록을 찾을 수 없습니다.');
    }
    const playerName = matchRecord.player?.name ?? id;
    await this.matchRecordsRepository.remove(matchRecord);
    return {
      message: `${playerName} 선수의 경기 기록이 삭제되었습니다.`,
      id,
    };
  }
}
