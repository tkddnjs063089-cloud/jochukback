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
  async create(createMatchResultDto: CreateMatchResultDto): Promise<{
    message: string;
    id: number;
    result: MatchResults;
  }> {
    try {
      console.log(
        '[MatchResultService.create] 받은 데이터:',
        createMatchResultDto,
      );
      return {
        message: '경기 결과가 생성되었습니다.',
        id: 1,
        result: this.matchResultsRepository.create(createMatchResultDto),
      };
    } catch (error) {
      console.error('[MatchResultService.create] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 생성 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
  async findAll(): Promise<MatchResults[]> {
    try {
      return await this.matchResultsRepository.find();
    } catch (error) {
      console.error('[MatchResultService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 결과 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
  async findByDateId(dateId: string): Promise<MatchResults[]> {
    try {
      const matchResults = await this.matchResultsRepository.find({
        where: { dateId },
      });
      if (!matchResults) {
        throw new NotFoundException(
          `[프론트엔드 문제] dateId 값이 ${dateId}인 경기 결과 목록을 찾을 수 없습니다. dateId를 확인해주세요.`,
        );
      }
      return matchResults;
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
