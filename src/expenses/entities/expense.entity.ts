import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from '../../players/entities/player.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Index('expenses_pkey', ['id'], { unique: true })
@Entity('expenses', { schema: 'public' })
export class Expenses {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'expense_date' })
  expenseDate: string;

  @Column('integer', { name: 'amount' })
  amount: number;

  @Column('character varying', { name: 'category', nullable: true, length: 30 })
  category: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;
}
