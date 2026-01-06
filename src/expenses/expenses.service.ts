import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expenses } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private readonly expensesRepository: Repository<Expenses>,
  ) {}
  async create(createExpenseDto: CreateExpenseDto): Promise<string> {
    const expense = this.expensesRepository.create(createExpenseDto);
    await this.expensesRepository.save(expense);
    return `${expense.expenseDate} 지출이 생성되었습니다.`;
  }
  async findAll(): Promise<Expenses[]> {
    return this.expensesRepository.find();
  }
  async findOne(id: number): Promise<Expenses> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 지출을 찾을 수 없습니다.');
    }
    return expense;
  }
  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<string> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 지출을 찾을 수 없습니다.');
    }
    await this.expensesRepository.save(
      Object.assign(expense, updateExpenseDto),
    );
    return `${expense.expenseDate} 지출이 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 지출을 찾을 수 없습니다.');
    }
    await this.expensesRepository.remove(expense);
    return `${expense.expenseDate} 지출이 삭제되었습니다.`;
  }
}
