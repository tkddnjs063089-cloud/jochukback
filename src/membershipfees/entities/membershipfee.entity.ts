import { Players } from 'src/players/entities/player.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('membership_fees_pkey', ['id'], { unique: true })
@Entity('membership_fees', { schema: 'public' })
export class MembershipFees {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'revenue_date', default: () => 'CURRENT_DATE' })
  revenueDate: string;

  @Column('integer', { name: 'amount', default: () => '0' })
  amount: number;

  @Column('integer', { name: 'month_count', default: () => '1' })
  monthCount: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('character varying', { name: 'player_name', length: 255 })
  playerName: string;
}
