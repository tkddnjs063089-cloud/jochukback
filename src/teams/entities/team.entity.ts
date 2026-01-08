import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchRecords } from 'src/match_records/entities/match_record.entity';
import { TeamPlayers } from 'src/team-players/entities/team-player.entity';
import { Matches } from 'src/matches/entities/match.entity';

@Index('teams_pkey', ['id'], { unique: true })
@Entity('teams', { schema: 'public' })
export class Teams {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'team_name', length: 255 })
  teamName: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @OneToMany(() => MatchRecords, (matchRecords) => matchRecords.team)
  matchRecords: MatchRecords[];

  @OneToMany(() => Matches, (matches) => matches.team)
  matches: Matches[];

  @OneToMany(() => TeamPlayers, (teamPlayers) => teamPlayers.team)
  teamPlayers: TeamPlayers[];
}
