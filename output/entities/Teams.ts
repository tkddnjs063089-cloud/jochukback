import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TeamPlayers } from "./TeamPlayers";

@Index("teams_pkey", ["id"], { unique: true })
@Entity("teams", { schema: "public" })
export class Teams {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @OneToMany(() => TeamPlayers, (teamPlayers) => teamPlayers.team)
  teamPlayers: TeamPlayers[];
}
