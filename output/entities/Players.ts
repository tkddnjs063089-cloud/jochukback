import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MatchRecords } from "./MatchRecords";

@Index("players_pkey", ["id"], { unique: true })
@Entity("players", { schema: "public" })
export class Players {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @Column("character varying", { name: "role", length: 20 })
  role: string;

  @Column("character varying", {
    name: "status",
    length: 20,
    default: () => "'ACTIVE'",
  })
  status: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @OneToMany(() => MatchRecords, (matchRecords) => matchRecords.player)
  matchRecords: MatchRecords[];
}
