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
@Index(
  'matches_match_date_match_order_team_type_key',
  ['matchDate', 'matchOrder', 'teamType'],
  { unique: true },
)
@Entity('matches', { schema: 'public' })
export class Matches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'match_date' }) // ✅ unique 제거
  matchDate: string;

  @Column('integer', { name: 'match_order' }) // ✅ unique 제거
  matchOrder: number;

  @Column('character varying', { name: 'team_type', length: 20 }) // ✅ unique 제거
  teamType: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @Column('integer', { name: 'match_date_id', nullable: true }) // ✅ FK 컬럼 추가
  matchDateId: number | null;

  @OneToOne(() => MatchRecords, (matchRecords) => matchRecords.match)
  matchRecords: MatchRecords;

  @ManyToOne(() => MatchDates, (matchDates) => matchDates.matches)
  @JoinColumn({ name: 'match_date_id' }) // ✅ 수정
  matchDateInfo: MatchDates; // ✅ 이름 변경
}
