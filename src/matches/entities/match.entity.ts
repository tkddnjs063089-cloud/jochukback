// matches.entity.ts
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchRecords } from '../../match_records/entities/match_record.entity';
import { MatchDates } from '../../match-dates/entities/match-date.entity';

@Index('matches_pkey', ['id'], { unique: true })
@Entity('matches', { schema: 'public' })
export class Matches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'match_date' })
  matchDate: string;

  @Column('integer', { name: 'match_order' })
  matchOrder: number;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  /** ✅ match_records 와의 1:1 관계 */
  @OneToOne(() => MatchRecords, (record) => record.match)
  matchRecords: MatchRecords;
}
