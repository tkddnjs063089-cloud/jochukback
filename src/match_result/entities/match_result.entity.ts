import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_results', { schema: 'public' })
export class MatchResults {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('timestamp without time zone', { name: 'date_id' })
  dateId: string;

  @Column('character varying', { name: 'team1_name', length: 50 })
  team1Name: string;

  @Column('integer', { name: 'team1_score', default: () => '0' })
  team1Score: number;

  @Column('character varying', { name: 'team2_name', length: 50 })
  team2Name: string;

  @Column('integer', { name: 'team2_score', default: () => '0' })
  team2Score: number;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;
}
