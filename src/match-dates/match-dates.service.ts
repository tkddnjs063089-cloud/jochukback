import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMatchDateDto } from './dto/create-match-date.dto';
import { UpdateMatchDateDto } from './dto/update-match-date.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchDates } from './entities/match-date.entity';

@Injectable()
export class MatchDatesService {
  constructor(
    @InjectRepository(MatchDates)
    private readonly matchDatesRepository: Repository<MatchDates>,
  ) {}

  async create(
    createMatchDateDto: CreateMatchDateDto,
  ): Promise<{ message: string; id: number; matchDate: MatchDates }> {
    try {
      if (!createMatchDateDto.eventDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] eventDate 필드가 누락되었습니다. 날짜를 입력해주세요.',
        );
      }

      const matchDate = this.matchDatesRepository.create(createMatchDateDto);
      await this.matchDatesRepository.save(matchDate);

      return {
        message: `${matchDate.eventDate} 경기 날짜가 생성되었습니다.`,
        id: matchDate.id,
        matchDate,
      };
    } catch (error) {
      console.error('[MatchDatesService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 등록된 경기 날짜입니다.',
        );
      }
      if (error.code === '22P02' || error.code === '22007') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 날짜 형식입니다. ISO 8601 형식(예: 2026-01-05T09:00:00.000Z)으로 입력해주세요. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 날짜 생성 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<MatchDates[]> {
    try {
      return await this.matchDatesRepository.find({
        order: { eventDate: 'DESC' },
      });
    } catch (error) {
      console.error('[MatchDatesService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 날짜 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<MatchDates> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 날짜 ID가 필요합니다.',
        );
      }

      const matchDate = await this.matchDatesRepository.findOne({
        where: { id },
      });
      if (!matchDate) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 날짜를 찾을 수 없습니다.`,
        );
      }
      return matchDate;
    } catch (error) {
      console.error('[MatchDatesService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 날짜 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateMatchDateDto: UpdateMatchDateDto,
  ): Promise<{ message: string; matchDate: MatchDates }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 날짜 ID가 필요합니다.',
        );
      }

      const matchDate = await this.matchDatesRepository.findOne({
        where: { id },
      });
      if (!matchDate) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 날짜를 찾을 수 없습니다.`,
        );
      }

      await this.matchDatesRepository.save(
        Object.assign(matchDate, updateMatchDateDto),
      );

      return {
        message: `${matchDate.eventDate} 경기 날짜가 수정되었습니다.`,
        matchDate,
      };
    } catch (error) {
      console.error('[MatchDatesService.update] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '22P02' || error.code === '22007') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 날짜 형식입니다. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 날짜 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 경기 날짜 ID가 필요합니다.',
        );
      }

      const matchDate = await this.matchDatesRepository.findOne({
        where: { id },
      });
      if (!matchDate) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 경기 날짜를 찾을 수 없습니다.`,
        );
      }

      const eventDate = matchDate.eventDate;
      await this.matchDatesRepository.remove(matchDate);

      return {
        message: `${eventDate} 경기 날짜가 삭제되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[MatchDatesService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이 경기 날짜와 연결된 기록이 있어 삭제할 수 없습니다. 연결된 기록을 먼저 삭제해주세요.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 경기 날짜 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
