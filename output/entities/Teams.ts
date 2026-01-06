import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Players } from "./Players";

@Index("teams_pkey", ["id"], { unique: true })
@Entity("teams", { schema: "public" })
export class Teams {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "team_name", length: 50 })
  teamName: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @OneToMany(() => Players, (players) => players.team)
  players: Players[];
}
