import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembershipFeeDto } from './dto/create-membershipfee.dto';
import { UpdateMembershipFeeDto } from './dto/update-membershipfee.dto';
import { MembershipFees } from './entities/membershipfee.entity';

@Injectable()
export class MembershipfeesService {
  constructor(
    @InjectRepository(MembershipFees)
    private readonly membershipFeesRepository: Repository<MembershipFees>,
  ) {}

  async create(
    createMembershipFeeDto: CreateMembershipFeeDto,
  ): Promise<{ message: string; id: number; membershipFee: MembershipFees }> {
    try {
      // 필수 필드 검증
      if (!createMembershipFeeDto.playerName) {
        throw new BadRequestException(
          '[프론트엔드 문제] playerName 필드가 누락되었습니다.',
        );
      }
      if (!createMembershipFeeDto.revenueDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] revenueDate 필드가 누락되었습니다.',
        );
      }
      if (createMembershipFeeDto.amount == null) {
        throw new BadRequestException(
          '[프론트엔드 문제] amount 필드가 누락되었습니다.',
        );
      }

      const membershipFee = this.membershipFeesRepository.create({
        revenueDate: createMembershipFeeDto.revenueDate,
        amount: createMembershipFeeDto.amount,
        monthCount: createMembershipFeeDto.monthCount,
      });
      await this.membershipFeesRepository.save(membershipFee);

      return {
        message: '회비가 성공적으로 등록되었습니다.',
        id: membershipFee.id,
        membershipFee,
      };
    } catch (error) {
      console.error('[MembershipfeesService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 존재하지 않는 선수 이름입니다. playerName를 확인해주세요.',
        );
      }
      if (error.code === '22P02') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 데이터 형식입니다. 날짜/숫자 형식을 확인해주세요. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 회비 등록 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<MembershipFees[]> {
    try {
      // findAll이 정상 수행되지 않을 때(아예 함수가 없을 때 등) 로그 추가
      if (!this.membershipFeesRepository?.find) {
        console.error(
          '[MembershipfeesService.findAll] membershipFeesRepository.find 함수가 존재하지 않습니다.',
        );
        throw new InternalServerErrorException(
          '[백엔드 문제] membershipFeesRepository.find 함수가 정의되어 있지 않습니다.',
        );
      }
      try {
        return await this.membershipFeesRepository.find({
          order: { revenueDate: 'DESC' },
          relations: ['player'],
        });
      } catch (frontendErr) {
        // 프론트 관련 에러를 여기서 구분하여 잡아서 던짐
        console.error(
          '[MembershipfeesService.findAll] 프론트엔드 연관 에러:',
          frontendErr,
        );
        throw new BadRequestException(
          `[프론트엔드 문제] 회비 목록을 불러오는 중 오류가 발생했습니다. 상세: ${frontendErr.message}`,
        );
      }
    } catch (error) {
      console.error('[MembershipfeesService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 회비 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<MembershipFees> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 회비 ID가 필요합니다.',
        );
      }

      const membershipFee = await this.membershipFeesRepository.findOne({
        where: { id },
      });
      if (!membershipFee) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 회비 정보를 찾을 수 없습니다.`,
        );
      }
      return membershipFee;
    } catch (error) {
      console.error('[MembershipfeesService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 회비 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateMembershipFeeDto: UpdateMembershipFeeDto,
  ): Promise<{ message: string; membershipFee: MembershipFees }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 회비 ID가 필요합니다.',
        );
      }

      const membershipFee = await this.membershipFeesRepository.findOne({
        where: { id },
      });
      if (!membershipFee) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 회비 정보를 찾을 수 없습니다.`,
        );
      }

      await this.membershipFeesRepository.save(
        Object.assign(membershipFee, updateMembershipFeeDto),
      );

      return {
        message: '회비 정보가 성공적으로 수정되었습니다.',
        membershipFee,
      };
    } catch (error) {
      console.error('[MembershipfeesService.update] 에러:', error);

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
        `[백엔드 문제] 회비 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 회비 ID가 필요합니다.',
        );
      }

      const membershipFee = await this.membershipFeesRepository.findOne({
        where: { id },
      });
      if (!membershipFee) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 회비 정보를 찾을 수 없습니다.`,
        );
      }

      await this.membershipFeesRepository.remove(membershipFee);

      return {
        message: '회비 정보가 성공적으로 삭제되었습니다.',
        id,
      };
    } catch (error) {
      console.error('[MembershipfeesService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 회비 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
