import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Matches } from "./Matches";

@Index("match_dates_event_date_key", ["eventDate"], { unique: true })
@Index("match_dates_pkey", ["id"], { unique: true })
@Entity("match_dates", { schema: "public" })
export class MatchDates {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "event_date", unique: true })
  eventDate: string;

  @Column("character varying", {
    name: "location",
    nullable: true,
    length: 100,
  })
  location: string | null;

  @Column("character varying", {
    name: "event_name",
    nullable: true,
    length: 100,
  })
  eventName: string | null;

  @OneToMany(() => Matches, (matches) => matches.matchDate_2)
  matches: Matches[];
}
