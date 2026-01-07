import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teams } from '../../teams/entities/team.entity';
import { Players } from '../../players/entities/player.entity';

@Index('team_players_pkey', ['id'], { unique: true })
@Index('team_players_team_id_player_id_key', ['teamId', 'playerId'], {
  unique: true,
})
@Entity('team_players', { schema: 'public' })
export class TeamPlayers {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'team_id' })
  teamId: number;

  @Column('integer', { name: 'player_id' })
  playerId: number;

  @Column('bigint', {
    name: 'joined_at',
    nullable: true,
  })
  joinedAt: number | null;

  @ManyToOne(() => Teams, (teams) => teams.teamPlayers, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;

  @ManyToOne(() => Players, (players) => players.teamPlayers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
