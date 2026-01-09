import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from '../../players/entities/player.entity';

@Index('membership_fees_pkey', ['id'], { unique: true })
@Entity('membership_fees', { schema: 'public' })
export class MembershipFees {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'revenue_date', default: () => 'CURRENT_DATE' })
  revenueDate: string;

  @Column('integer', { name: 'amount', default: () => '0' })
  amount: number;

  @Column('character varying', { name: 'player_name', length: 50 })
  playerName: string;

  @Column('integer', { name: 'month_count', default: () => '1' })
  monthCount: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;
}
