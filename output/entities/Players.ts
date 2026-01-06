import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expenses } from './Expenses';
import { MatchRecords } from './MatchRecords';
import { MembershipFees } from './MembershipFees';
import { Teams } from './Teams';
import { TeamPlayers } from './TeamPlayers';

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

  @OneToMany(() => Expenses, (expenses) => expenses.player)
  expenses: Expenses[];

  @OneToMany(() => MatchRecords, (matchRecords) => matchRecords.player)
  matchRecords: MatchRecords[];

  @OneToMany(() => MembershipFees, (membershipFees) => membershipFees.player)
  membershipFees: MembershipFees[];

  @OneToMany(() => TeamPlayers, (teamPlayers) => teamPlayers.player)
  teamPlayers: TeamPlayers[];

  @ManyToOne(() => Teams, (teams) => teams.players, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;
}
