import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expenses } from './entities/expense.entity';
import { Players } from 'src/players/entities/player.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private readonly expensesRepository: Repository<Expenses>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
  ): Promise<{ message: string; id: number; expense: Expenses }> {
    try {
      // 필수 필드 검증
      if (!createExpenseDto.expenseDate) {
        throw new BadRequestException(
          '[프론트엔드 문제] expenseDate 필드가 누락되었습니다.',
        );
      }
      if (createExpenseDto.amount == null) {
        throw new BadRequestException(
          '[프론트엔드 문제] amount 필드가 누락되었습니다.',
        );
      }

      const expense = this.expensesRepository.create(createExpenseDto);
      await this.expensesRepository.save(expense);

      return {
        message: `${expense.category} 지출 내역이 등록되었습니다.`,
        id: expense.id,
        expense,
      };
    } catch (error) {
      console.error('[ExpensesService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 존재하지 않는 지출 내역 ID입니다. id를 확인해주세요.',
        );
      }
      if (error.code === '22P02') {
        throw new BadRequestException(
          `[프론트엔드 문제] 잘못된 데이터 형식입니다. 날짜/숫자 형식을 확인해주세요. 상세: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 지출 내역 등록 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Expenses[]> {
    try {
      return await this.expensesRepository.find();
    } catch (error) {
      console.error('[ExpensesService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 지출 내역 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<Expenses> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 지출 ID가 필요합니다.',
        );
      }

      const expense = await this.expensesRepository.findOne({
        where: { id },
      });
      if (!expense) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 지출 내역을 찾을 수 없습니다.`,
        );
      }
      return expense;
    } catch (error) {
      console.error('[ExpensesService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 지출 내역 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<{ message: string; expense: Expenses }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 지출 ID가 필요합니다.',
        );
      }

      const expense = await this.expensesRepository.findOne({ where: { id } });
      if (!expense) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 지출 내역을 찾을 수 없습니다.`,
        );
      }

      await this.expensesRepository.save(
        Object.assign(expense, updateExpenseDto),
      );

      return {
        message: `${expense.expenseDate} 지출 내역이 수정되었습니다.`,
        expense,
      };
    } catch (error) {
      console.error('[ExpensesService.update] 에러:', error);

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
        `[백엔드 문제] 지출 내역 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 지출 ID가 필요합니다.',
        );
      }

      const expense = await this.expensesRepository.findOne({ where: { id } });
      if (!expense) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 지출 내역을 찾을 수 없습니다.`,
        );
      }

      const expenseDate = expense.expenseDate;
      await this.expensesRepository.remove(expense);

      return {
        message: `${expenseDate} 지출 내역이 삭제되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[ExpensesService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 지출 내역 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
