import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Matches } from '../../matches/entities/match.entity';
import { Players } from '../../players/entities/player.entity';
import { Teams } from 'src/teams/entities/team.entity';

@Index('match_records_pkey', ['id'], { unique: true })
@Entity('match_records', { schema: 'public' })
export class MatchRecords {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'team_id' })
  teamId: number;

  @Column('integer', { name: 'player_id' })
  playerId: number;

  @Column('boolean', { name: 'attendance', default: () => 'false' })
  attendance: boolean = false;

  @Column('integer', {
    name: 'clean_sheet',
    nullable: true,
    default: () => '0',
  })
  cleanSheet: number | null;

  @OneToOne(() => Matches, (matches) => matches.matchRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'match_id', referencedColumnName: 'id' }])
  match: Matches;

  @ManyToOne(() => Players, (players) => players.matchRecords)
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;

  @ManyToOne(() => Teams, (teams) => teams.matchRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;
}
