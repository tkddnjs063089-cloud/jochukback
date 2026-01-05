import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchRecords } from '../../match_records/entities/match_record.entity';

@Index('matches_pkey', ['id'], { unique: true })
@Index(
  'matches_match_date_match_order_team_type_key',
  ['matchDate', 'matchOrder', 'teamType'],
  { unique: true },
)
@Entity('matches', { schema: 'public' })
export class Matches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'match_date' })
  matchDate: string;

  @Column('integer', { name: 'match_order' })
  matchOrder: number;

  @Column('character varying', { name: 'team_type', length: 20 })
  teamType: 'PINK' | 'BLACK' = 'PINK';

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @OneToOne(() => MatchRecords, (matchRecords) => matchRecords.match)
  matchRecords: MatchRecords;
}
