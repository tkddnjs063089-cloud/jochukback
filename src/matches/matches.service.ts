import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async create(createMatchDto: CreateMatchDto): Promise<{
    message: string;
    id: number;
    matchDate: string;
    matchOrder: number;
    teamId?: number;
  }> {
    try {
      // 필수 필드 검증
      if (!createMatchDto.matchDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] matchDate 필드가 누락되었습니다. 요청 데이터를 확인해주세요.',
        );
      }
      if (!createMatchDto.matchOrder) {
        throw new BadRequestException(
          '[프론트엔드 문제] matchOrder 필드가 누락되었습니다. 요청 데이터를 확인해주세요.',
        );
      }

      // 중복 체크
      const existing = await this.matchesRepository.findOne({
        where: {
          matchDate: createMatchDto.matchDate,
          matchOrder: createMatchDto.matchOrder,
        },
      });

      if (existing) {
        throw new BadRequestException(
          `[프론트엔드 문제] ${createMatchDto.matchDate}일 ${createMatchDto.matchOrder}번째 경기는 이미 존재합니다. 다른 날짜나 순서를 선택해주세요.`,
        );
      }

      const match = this.matchesRepository.create({
        matchDate: createMatchDto.matchDate,
        matchOrder: createMatchDto.matchOrder,
        teamId: createMatchDto.teamId ?? null,
      });

      await this.matchesRepository.save(match);

      return {
        message: `${createMatchDto.matchDate}일 ${createMatchDto.matchOrder}번째 경기가 생성되었습니다.`,
        id: match.id,
        matchDate: match.matchDate,
        matchOrder: match.matchOrder,
        teamId: match.teamId ?? undefined,
      };
    } catch (error) {
      console.error('[MatchesService.create] 에러:', error);

      // 이미 처리된 에러는 그대로 throw
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // DB 관련 에러
      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 중복된 경기입니다. 같은 날짜와 순서의 경기가 이미 존재합니다.',
        );
      }
      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 존재하지 않는 팀 ID입니다. teamId를 확인해주세요.',
        );
      }
      if (error.code === '22P02') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 데이터 형식입니다. 숫자/날짜 형식을 확인해주세요. 상세: ${error.message}`,
        );
      }

      // 기타 서버 에러
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 생성 중 서버 오류가 발생했습니다. 관리자에게 문의하세요. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Matches[]> {
    try {
      return await this.matchesRepository.find();
    } catch (error) {
      console.error('[MatchesService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByDateId(dateId: string): Promise<Matches[]> {
    try {
      if (!dateId) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 dateId가 필요합니다.',
        );
      }

      const matches = await this.matchesRepository.find({
        where: { matchDate: dateId },
      });
      if (matches.length === 0) {
        throw new NotFoundException(
          `[프론트엔드 문제] dateId가 ${dateId}인 경기를 찾을 수 없습니다. 존재하는 경기 dateId인지 확인해주세요.`,
        );
      }
      return matches;
    } catch (error) {
      console.error('[MatchesService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByDate(matchDate: string): Promise<Matches[]> {
    try {
      if (!matchDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] matchDate 파라미터가 필요합니다.',
        );
      }

      const matches = await this.matchesRepository.find({
        where: { matchDate },
        order: { matchOrder: 'ASC' },
      });

      if (matches.length === 0) {
        throw new NotFoundException(
          `[프론트엔드 문제] ${matchDate} 날짜의 경기를 찾을 수 없습니다. 날짜 형식(YYYY-MM-DD)을 확인해주세요.`,
        );
      }
      return matches;
    } catch (error) {
      console.error('[MatchesService.findByDate] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 날짜별 경기 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByDateAndOrder(
    matchDate: string,
    matchOrder: number,
  ): Promise<Matches> {
    try {
      if (!matchDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] matchDate 파라미터가 필요합니다.',
        );
      }
      if (!matchOrder || isNaN(matchOrder)) {
        throw new BadRequestException(
          '[프론트엔드 문제] matchOrder 파라미터는 숫자여야 합니다.',
        );
      }

      const match = await this.matchesRepository.findOne({
        where: { matchDate, matchOrder },
      });

      if (!match) {
        throw new NotFoundException(
          `[프론트엔드 문제] ${matchDate} ${matchOrder}번째 경기를 찾을 수 없습니다.`,
        );
      }
      return match;
    } catch (error) {
      console.error('[MatchesService.findByDateAndOrder] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateMatchDto: UpdateMatchDto,
  ): Promise<{ message: string; match: Matches }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 ID가 필요합니다.',
        );
      }

      const match = await this.matchesRepository.findOne({ where: { id } });
      if (!match) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기를 찾을 수 없습니다.`,
        );
      }

      // 중복 체크 (다른 경기와 충돌 방지)
      if (updateMatchDto.matchDate && updateMatchDto.matchOrder) {
        const existing = await this.matchesRepository.findOne({
          where: {
            matchDate: updateMatchDto.matchDate,
            matchOrder: updateMatchDto.matchOrder,
          },
        });
        if (existing && existing.id !== id) {
          throw new BadRequestException(
            '[프론트엔드 문제] 해당 날짜/순서의 경기가 이미 존재합니다.',
          );
        }
      }

      await this.matchesRepository.save(Object.assign(match, updateMatchDto));
      return {
        message: `${match.matchDate}일 ${match.matchOrder}번째 경기가 수정되었습니다.`,
        match,
      };
    } catch (error) {
      console.error('[MatchesService.update] 에러:', error);

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
        `[백엔드 문제] 경기 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 ID가 필요합니다.',
        );
      }

      const match = await this.matchesRepository.findOne({ where: { id } });
      if (!match) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기를 찾을 수 없습니다.`,
        );
      }

      const matchDate = match.matchDate;
      const matchOrder = match.matchOrder;
      await this.matchesRepository.remove(match);

      return {
        message: `${matchDate}일 ${matchOrder}번째 경기가 삭제되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[MatchesService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이 경기와 연결된 다른 데이터가 있어 삭제할 수 없습니다. 연결된 기록을 먼저 삭제해주세요.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
