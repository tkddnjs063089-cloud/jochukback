import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expenses } from './entities/expense.entity';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
  @Post()
  @ApiOperation({
    summary: '지출 내역 등록',
    description: '지출 내역을 등록합니다.',
  })
  @ApiBody({
    type: CreateExpenseDto,
    examples: {
      홍길동: {
        value: {
          expenseDate: '2026-01-05',
          amount: 50000,
          category: '식비',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '지출 내역이 성공적으로 등록되었습니다.',
  })
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<{ message: string; id: number; expense: Expenses }> {
    return await this.expensesService.create(createExpenseDto);
  }
  @Get()
  @ApiOperation({
    summary: '전체 지출 내역 조회',
    description: '모든 지출 내역을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '지출 내역 목록 조회 성공' })
  async findAll(): Promise<Expenses[]> {
    return await this.expensesService.findAll();
  }
  @Get(':id')
  @ApiOperation({
    summary: '지출 내역 상세 조회',
    description: 'ID로 특정 지출 내역을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '지출 내역 ID', example: 1 })
  @ApiResponse({ status: 200, description: '지출 내역 상세 조회 성공' })
  async findOne(@Param('id') id: number): Promise<Expenses> {
    return await this.expensesService.findOne(id);
  }
  @Patch(':id')
  @ApiOperation({
    summary: '지출 내역 수정',
    description: 'ID로 특정 지출 내역을 수정합니다.',
  })
  @ApiBody({
    type: UpdateExpenseDto,
    examples: {
      홍길동: {
        value: {
          expenseDate: '2026-01-05',
          amount: 50000,
          category: '식비',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '지출 내역 수정 성공' })
  async update(
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<{ message: string; expense: Expenses }> {
    return await this.expensesService.update(id, updateExpenseDto);
  }
  @Delete(':id')
  @ApiOperation({
    summary: '지출 내역 삭제',
    description: 'ID로 특정 지출 내역을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '지출 내역 ID', example: 1 })
  @ApiResponse({ status: 200, description: '지출 내역 삭제 성공' })
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; id: number }> {
    return await this.expensesService.remove(id);
  }
}
