import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expenses } from '../../expenses/entities/expense.entity';
import { MatchRecords } from '../../match_records/entities/match_record.entity';
import { MembershipFees } from 'src/membershipfees/entities/membershipfee.entity';
import { Teams } from 'src/teams/entities/team.entity';

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
  @ManyToOne(() => Teams, (teams) => teams.players, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;
}
