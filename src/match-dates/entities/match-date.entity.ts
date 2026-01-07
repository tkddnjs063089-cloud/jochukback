import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchRecords } from '../../match_records/entities/match_record.entity';

@Index('match_dates_event_date_key', ['eventDate'], { unique: true })
@Index('match_dates_pkey', ['id'], { unique: true })
@Entity('match_dates', { schema: 'public' })
export class MatchDates {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp without time zone', { name: 'event_date', unique: true })
  eventDate: Date;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  // 한 날짜에 여러 경기 기록이 연결됨
  @OneToMany(() => MatchRecords, (matchRecords) => matchRecords.matchDate)
  matchRecords: MatchRecords[];
}
