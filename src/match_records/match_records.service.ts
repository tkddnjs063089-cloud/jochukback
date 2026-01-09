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
      console.log(
        '[MatchRecordsService.create] 받은 데이터:',
        createMatchRecordDto,
      );

      // 필수 필드 검증
      if (!createMatchRecordDto.playerId) {
        throw new BadRequestException(
          '[프론트엔드 문제] playerId 필드가 누락되었습니다. 선수 ID를 입력해주세요.',
        );
      }

      const player = await this.playersRepository.findOne({
        where: { id: createMatchRecordDto.playerId },
      });
      if (!player) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${createMatchRecordDto.playerId}인 선수를 찾을 수 없습니다. playerId를 확인해주세요.`,
        );
      }

      // teamId가 있으면 팀 조회
      let team: Teams | undefined = undefined;
      if (createMatchRecordDto.teamId) {
        const foundTeam = await this.teamsRepository.findOne({
          where: { id: createMatchRecordDto.teamId },
        });
        if (!foundTeam) {
          throw new NotFoundException(
            `[프론트엔드 문제] ID가 ${createMatchRecordDto.teamId}인 팀을 찾을 수 없습니다. teamId를 확인해주세요.`,
          );
        }
        team = foundTeam;
      }

      // 프론트 호환: goal → goals, assist → assists 매핑
      const goals =
        createMatchRecordDto.goal ?? createMatchRecordDto.goals ?? 0;
      const assists =
        createMatchRecordDto.assist ?? createMatchRecordDto.assists ?? 0;

      // dateId 변환: 'YYYY-MM-DD' 형식으로 통일
      let dateIdValue: string | null = null;
      if (createMatchRecordDto.dateId != null) {
        if (typeof createMatchRecordDto.dateId === 'number') {
          // 프론트에서 받은 timestamp를 KST 기준으로 YYYY-MM-DD 변환
          const d = new Date(createMatchRecordDto.dateId);
          const pad = (n: number) => n.toString().padStart(2, '0');
          // 로컬 시간 기준으로 변환 (프론트가 로컬 타임스탬프를 보낸다고 가정)
          dateIdValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate(),
          )}`;
        } else if (typeof createMatchRecordDto.dateId === 'string') {
          // '2026-01-01T00:00:00.000Z' 또는 '2026-01-01' 모두 처리
          if (createMatchRecordDto.dateId.includes('T')) {
            dateIdValue = createMatchRecordDto.dateId.split('T')[0];
          } else {
            dateIdValue = createMatchRecordDto.dateId;
          }
        }
      }

      // [UPSERT 구현] 기존 기록 조회
      // playerId, teamId, dateId 세트가 같으면 동일한 기록으로 간주
      const findOptions: any = {
        playerId: createMatchRecordDto.playerId,
        dateId: dateIdValue as any,
      };

      if (createMatchRecordDto.teamId) {
        findOptions.teamId = createMatchRecordDto.teamId;
      } else {
        // teamId가 없거나 null인 경우 (TypeORM에서 IsNull()을 써야 정확히 매칭됨)
        const { IsNull } = require('typeorm');
        findOptions.teamId = IsNull();
      }

      let matchRecord = await this.matchRecordsRepository.findOne({
        where: findOptions,
      });

      if (matchRecord) {
        // [UPDATE] 기존 기록이 있으면 업데이트
        console.log(
          '[MatchRecordsService.create] 기존 기록 업데이트 ID:',
          matchRecord.id,
        );
        matchRecord.attendance =
          createMatchRecordDto.attendance ?? matchRecord.attendance;
        matchRecord.late = createMatchRecordDto.late ?? matchRecord.late;
        matchRecord.goals = goals;
        matchRecord.assists = assists;
        matchRecord.cleanSheet =
          createMatchRecordDto.cleanSheet ?? matchRecord.cleanSheet;
        matchRecord.mom = createMatchRecordDto.mom ?? matchRecord.mom;
        matchRecord.wins = createMatchRecordDto.wins ?? matchRecord.wins;
        matchRecord.draws = createMatchRecordDto.draws ?? matchRecord.draws;
        matchRecord.losses = createMatchRecordDto.losses ?? matchRecord.losses;
      } else {
        // [INSERT] 없으면 새로 생성
        console.log('[MatchRecordsService.create] 신규 기록 생성');
        matchRecord = this.matchRecordsRepository.create({
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
      }

      await this.matchRecordsRepository.save(matchRecord);

      return {
        message: `${player.name} 선수의 경기 기록이 생성되었습니다.`,
        id: matchRecord.id,
        record: matchRecord,
      };
    } catch (error) {
      console.error('[MatchRecordsService.create] 에러 발생:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 동일한 선수/날짜 조합의 경기 기록이 존재합니다. 중복 등록은 불가능합니다.',
        );
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 존재하지 않는 팀, 선수 또는 날짜 ID입니다. ID 값을 확인해주세요.',
        );
      }

      if (error.code === '22P02') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 데이터 형식입니다. 숫자/날짜 형식을 확인해주세요. 상세: ${error.message}`,
        );
      }

      if (error.message?.includes('column')) {
        throw new InternalServerErrorException(
          `[백엔드 문제] DB 컬럼 에러입니다. 관리자에게 문의하세요. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 기록 생성 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<MatchRecords[]> {
    try {
      return await this.matchRecordsRepository.find({
        relations: ['player', 'team'],
      });
    } catch (error) {
      console.error('[MatchRecordsService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 기록 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByDateId(dateId: string): Promise<MatchRecords[]> {
    try {
      if (!dateId) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 기록 dateId 값이 필요합니다.',
        );
      }

      const matchRecords = await this.matchRecordsRepository.find({
        where: { dateId },
        relations: ['player', 'team'],
      });
      if (!matchRecords) {
        throw new NotFoundException(
          `[프론트엔드 문제] dateId 값이 ${dateId}인 경기 기록 목록을 찾을 수 없습니다.`,
        );
      }
      return matchRecords;
    } catch (error) {
      console.error('[MatchRecordsService.findByDateId] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 기록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateMatchRecordDto: UpdateMatchRecordDto,
  ): Promise<{ message: string; record: MatchRecords }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 기록 ID가 필요합니다.',
        );
      }

      const matchRecord = await this.matchRecordsRepository.findOne({
        where: { id },
        relations: ['player'],
      });
      if (!matchRecord) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 기록을 찾을 수 없습니다.`,
        );
      }

      await this.matchRecordsRepository.save(
        Object.assign(matchRecord, updateMatchRecordDto),
      );

      return {
        message: `${matchRecord.player?.name ?? id} 선수의 경기 기록이 수정되었습니다.`,
        record: matchRecord,
      };
    } catch (error) {
      console.error('[MatchRecordsService.update] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '22P02') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 데이터 형식입니다. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 기록 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 기록 ID가 필요합니다.',
        );
      }

      const matchRecord = await this.matchRecordsRepository.findOne({
        where: { id },
        relations: ['player'],
      });
      if (!matchRecord) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 기록을 찾을 수 없습니다.`,
        );
      }

      const playerName = matchRecord.player?.name ?? id;
      await this.matchRecordsRepository.remove(matchRecord);

      return {
        message: `${playerName} 선수의 경기 기록이 삭제되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[MatchRecordsService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 기록 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
