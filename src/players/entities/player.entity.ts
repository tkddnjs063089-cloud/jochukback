import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expenses } from '../../expenses/entities/expense.entity';
import { MatchRecords } from '../../match_records/entities/match_record.entity';
import { MembershipFees } from 'src/membershipfees/entities/membershipfee.entity';
import { TeamPlayers } from 'src/team-players/entities/team-player.entity';

@Index('players_pkey', ['id'], { unique: true })
@Entity('players', { schema: 'public' })
export class Players {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @OneToMany(() => MatchRecords, (matchRecords) => matchRecords.player)
  matchRecords: MatchRecords[];

  @OneToMany(() => TeamPlayers, (teamPlayers) => teamPlayers.player)
  teamPlayers: TeamPlayers[];
}
