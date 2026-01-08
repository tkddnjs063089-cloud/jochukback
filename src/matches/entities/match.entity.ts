// matches.entity.ts
import { Teams } from 'src/teams/entities/team.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('matches_pkey', ['id'], { unique: true })
@Entity('matches', { schema: 'public' })
export class Matches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'match_date' })
  matchDate: string;

  @Column('integer', { name: 'match_order' })
  matchOrder: number;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @ManyToOne(() => Teams, (teams) => teams.matches)
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  team: Teams;
}
