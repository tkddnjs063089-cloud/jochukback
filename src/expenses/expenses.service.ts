import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}
  async create(createExpenseDto: CreateExpenseDto): Promise<string> {
    const player = await this.playersRepository.findOne({
      where: { id: createExpenseDto.playerId },
    });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    const expense = this.expensesRepository.create(createExpenseDto);
    expense.player = player;
    await this.expensesRepository.save(expense);
    return `${player.name}의 ${expense.category} 회비가 납부되었습니다.`;
  }
  async findAll(): Promise<Expenses[]> {
    return this.expensesRepository.find();
  }
  async findOne(id: number): Promise<Expenses> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 회비 납부 내역을 찾을 수 없습니다.');
    }
    return expense;
  }
  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<string> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 회비 납부 내역을 찾을 수 없습니다.');
    }
    await this.expensesRepository.save(
      Object.assign(expense, updateExpenseDto),
    );
    return `${expense.expenseDate} 회비 납부 내역이 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('해당 회비 납부 내역을 찾을 수 없습니다.');
    }
    await this.expensesRepository.remove(expense);
    return `${expense.expenseDate} 회비 납부 내역이 삭제되었습니다.`;
  }
}
