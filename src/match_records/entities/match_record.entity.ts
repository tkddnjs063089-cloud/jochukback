import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from '../../players/entities/player.entity';
import { Teams } from 'src/teams/entities/team.entity';
import { MatchDates } from 'src/match-dates/entities/match-date.entity';

@Index('match_records_pkey', ['id'], { unique: true })
@Entity('match_records', { schema: 'public' })
export class MatchRecords {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'team_id', nullable: true })
  teamId: number | null;

  @Column('integer', { name: 'player_id' })
  playerId: number;

  @Column('integer', { name: 'date_id', nullable: true })
  dateId: number | null;

  @Column('boolean', { name: 'attendance', default: () => 'false' })
  attendance: boolean = false;

  @Column('integer', { name: 'goals', nullable: true, default: () => '0' })
  goals: number = 0;

  @Column('integer', { name: 'assists', nullable: true, default: () => '0' })
  assists: number = 0;

  @Column('integer', {
    name: 'yellow_card',
    nullable: true,
    default: () => '0',
  })
  yellowCard: number = 0;

  @Column('integer', { name: 'red_card', nullable: true, default: () => '0' })
  redCard: number = 0;

  @Column('integer', {
    name: 'clean_sheet',
    nullable: true,
    default: () => '0',
  })
  cleanSheet: number = 0;

  @Column('boolean', { name: 'mom', default: () => 'false' })
  mom: boolean = false;

  @Column('integer', { name: 'wins', nullable: true, default: () => '0' })
  wins: number = 0;

  @Column('integer', { name: 'draws', nullable: true, default: () => '0' })
  draws: number = 0;

  @Column('integer', { name: 'losses', nullable: true, default: () => '0' })
  losses: number = 0;

  @ManyToOne(() => Players, (players) => players.matchRecords)
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;

  @ManyToOne(() => Teams, (teams) => teams.matchRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;

  // 경기 일정과의 관계 (여러 기록이 하나의 날짜 참조)
  @ManyToOne(() => MatchDates, (matchDates) => matchDates.matchRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'date_id', referencedColumnName: 'id' }])
  matchDate: MatchDates;
}
