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

@Index('match_records_pkey', ['id'], { unique: true })
@Index('unique_mom_per_match', ['matchId'], { unique: true })
@Index('match_records_match_id_player_id_key', ['matchId', 'playerId'], {
  unique: true,
})
@Entity('match_records', { schema: 'public' })
export class MatchRecords {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'match_id', unique: true })
  matchId: number;

  @Column('integer', { name: 'player_id', unique: true })
  playerId: number;

  @Column('boolean', { name: 'status', default: () => 'false' })
  status: boolean = false;

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
}
