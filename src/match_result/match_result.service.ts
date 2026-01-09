import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchResultDto } from './dto/create-match_result.dto';
import { UpdateMatchResultDto } from './dto/update-match_result.dto';
import { MatchResults } from './entities/match_result.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatchResultService {
  constructor(
    @InjectRepository(MatchResults)
    private readonly matchResultsRepository: Repository<MatchResults>,
  ) {}
  async create(createDto: CreateMatchResultDto) {
    // dateId 변환: 'YYYY-MM-DD' 형식으로 통일
    let dateIdValue: string = createDto.dateId;
    if (createDto.dateId) {
      const d = new Date(createDto.dateId);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        dateIdValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate(),
        )}`;
      }
    }

    // [UPSERT 구현] 기존 경기 결과 조회 (날짜와 양 팀 이름이 같으면 동일 경기로 간주)
    let matchResult = await this.matchResultsRepository.findOne({
      where: {
        dateId: dateIdValue,
        team1Name: createDto.team1Name,
        team2Name: createDto.team2Name,
      },
    });

    if (matchResult) {
      // [UPDATE] 기존 결과 업데이트
      console.log(
        '[MatchResultService.create] 기존 결과 업데이트 ID:',
        matchResult.id,
      );
      matchResult.team1Score = createDto.team1Score;
      matchResult.team2Score = createDto.team2Score;
    } else {
      // [INSERT] 신규 생성
      console.log('[MatchResultService.create] 신규 결과 생성');
      matchResult = this.matchResultsRepository.create({
        ...createDto,
        dateId: dateIdValue,
      });
    }

    return await this.matchResultsRepository.save(matchResult);
  }

  async findAll(): Promise<MatchResults[]> {
    try {
      return await this.matchResultsRepository.find({
        order: { id: 'ASC' },
      });
    } catch (error) {
      console.error('[MatchResultService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByDateId(dateId: string): Promise<MatchResults[]> {
    try {
      return await this.matchResultsRepository.find({
        where: { dateId: dateId },
      });
    } catch (error) {
      console.error('[MatchResultService.findByDateId] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
  async update(
    dateId: string,
    updateMatchResultDto: UpdateMatchResultDto,
  ): Promise<{
    message: string;
    result: MatchResults;
  }> {
    try {
      console.log(
        '[MatchResultService.update] 받은 데이터:',
        updateMatchResultDto,
      );
      return {
        message: '경기 결과가 수정되었습니다.',
        result: await this.matchResultsRepository.save({
          dateId: dateId,
          ...updateMatchResultDto,
        }),
      };
    } catch (error) {
      console.error('[MatchResultService.update] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
  async remove(id: number): Promise<{
    message: string;
    id: number;
  }> {
    try {
      console.log('[MatchResultService.remove] 받은 데이터:', id);
      await this.matchResultsRepository.delete(id);
      return {
        message: '경기 결과가 삭제되었습니다.',
        id: id,
      };
    } catch (error) {
      console.error('[MatchResultService.remove] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
