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

      // dateId 변환: 숫자(ms timestamp)이면 타임존 보정 없이
      // Postgres `timestamp without time zone`에 그대로 저장할 수 있도록
      // 'YYYY-MM-DD HH:mm:ss' 형식으로 포맷합니다.
      let dateIdValue: string | null = null;
      if (createMatchRecordDto.dateId != null) {
        if (typeof createMatchRecordDto.dateId === 'number') {
          // 프론트가 로컬(예: KST) 기준으로 생성한 밀리초 타임스탬프를
          // 서버에서 동일한 '벽시각'으로 저장하려면 클라이언트의 UTC 오프셋을
          // 더해주어야 합니다. 여기서는 KST(UTC+9)를 가정해 9시간을 더합니다.
          const KST_OFFSET = 9 * 60 * 60 * 1000;
          const d = new Date(createMatchRecordDto.dateId + KST_OFFSET);
          const pad = (n: number) => n.toString().padStart(2, '0');
          dateIdValue = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
            d.getUTCDate(),
          )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
            d.getUTCSeconds(),
          )}`;
        } else {
          dateIdValue = createMatchRecordDto.dateId;
        }
      }

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

      console.log('[MatchRecordsService.create] 저장할 데이터:', matchRecord);

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

  async findOne(id: number): Promise<MatchRecords> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 기록 ID가 필요합니다.',
        );
      }

      const matchRecord = await this.matchRecordsRepository.findOne({
        where: { id },
        relations: ['player', 'team'],
      });
      if (!matchRecord) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 기록을 찾을 수 없습니다.`,
        );
      }
      return matchRecord;
    } catch (error) {
      console.error('[MatchRecordsService.findOne] 에러:', error);

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
