// matches.entity.ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
}
