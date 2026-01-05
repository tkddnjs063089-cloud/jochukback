import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expenses } from './entities/expense.entity';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [TypeOrmModule.forFeature([Expenses])],
})
export class ExpensesModule {}
